import { JsonRpcProvider, Network } from '@mysten/sui.js';
import MintToken from './mint-token'

// const provider = new JsonRpcProvider(Network.DEVNET);
// example: https://github.com/MystenLabs/sui/blob/main/apps/wallet/examples/demo-nft-dapp/pages/index.js


function App() {

  return (
    <div className="App">
        <MintToken />
    </div>
  )
}

export default App
