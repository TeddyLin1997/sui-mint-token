
import { useCallback, useEffect, useState } from 'react';
import Neil from './img/neil.png'

const useSuiWallet = () => {
    const [wallet, setWallet] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const cb = () => {
            setLoaded(true);
            setWallet((window as any).suiWallet);
        };
        if ((window as any).suiWallet) {
            cb();
            return;
        }
        window.addEventListener('load', cb);
        return () => {
            window.removeEventListener('load', cb);
        };
    }, []);
    return wallet || (loaded ? false : null);
};

export default function Home() {
    const [walletInstalled, setWalletInstalled] = useState<boolean | null>(null);
    const [connected, setConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [msgNotice, setMsgNotice] = useState<any>(null);
    const [account, setAccount] = useState(null);
    const suiWallet = useSuiWallet();
    useEffect(() => {
        setWalletInstalled(suiWallet && true);
        if (suiWallet) {
            (suiWallet as any).hasPermissions().then(setConnected, setMsgNotice);
        }
    }, [suiWallet]);
    const onConnectClick = useCallback(async () => {
        if (!suiWallet) {
            return;
        }
        setConnecting(true);
        try {
            await (suiWallet as any).requestPermissions();
            setConnected(true);
        } catch (e) {
            setMsgNotice(e as any);
        } finally {
            setConnecting(false);
        }
    }, [suiWallet]);
    useEffect(() => {
        if (connected && suiWallet) {
            (suiWallet as any)
                .getAccounts()
                .then((accounts: any) => setAccount(accounts[0]), setMsgNotice);
        } else {
            setAccount(null);
        }
    }, [connected, suiWallet]);
    useEffect(() => {
        let timeout: any;
        if (msgNotice) {
            timeout = setTimeout(() => setMsgNotice(null), 10000);
        }
        return () => clearTimeout(timeout);
    }, [msgNotice]);
    const [creating, setCreating] = useState(false);

    const onCreateClick = useCallback(async () => {
        setCreating(true);
        try {
            const result = await (suiWallet as any).executeMoveCall({
                packageObjectId: '0x078e8ad03721c79b0dbde7fb13b8817aa8dd1cde',
                module: 'christoken',
                function: 'mint',
                typeArguments: [],
                arguments: ['0xfb68029fa3681443b98a1d3955833538001405c8'],
                gasBudget: 10000,
            });
            const nftID = result?.EffectResponse?.effects?.created?.[0]?.reference?.objectId;
            setMsgNotice(`ChrisToken successfully created. ${nftID ? `ID: ${nftID}` : ''}`);
        } catch (e) {
            setMsgNotice(e);
        } finally {
            setCreating(false);
        }
    }, [suiWallet]);
    return (
        <div>
            <head>
              <title>Welcome to mint CT(ChrisToken)</title>
              <link rel="icon" href="/favicon.png" />
            </head>

            <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={Neil} alt="" />
              {walletInstalled ? (
                <div>
                  {connected ? (
                    <div>
                      <h4>Wallet connected</h4>
                      <label>
                        Wallet account: <div>{account}</div>
                      </label>
                      <div>
                        <h2>Mint Chris Token</h2>
                        <button type="button" onClick={onCreateClick} disabled={creating}>Mint</button>
                      </div>
                    </div>
                  ) : (
                    <button type="button" onClick={onConnectClick} disabled={connecting}>Connect</button>
                  )}
                </div>
              ) : walletInstalled === false ? (
                  <h6>It seems Sui Wallet is not installed.</h6>
              ) : null}
              {msgNotice ? (
                  <div className="error">
                      <pre>
                          {msgNotice.message ||
                              JSON.stringify(msgNotice, null, 4)}
                      </pre>
                  </div>
              ) : null}
            </main>
        </div>
    );
}