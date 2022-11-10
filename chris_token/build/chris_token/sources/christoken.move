module chris_token::christoken {
    use sui::coin;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::balance::{Self, Supply};
    use sui::object::{Self, UID};

    struct CHRISTOKEN has drop {}

    struct Reserve has key {
        id: UID,
        total_supply: Supply<CHRISTOKEN>,
    }

    fun init(witness: CHRISTOKEN, ctx: &mut TxContext) {
        let total_supply = balance::create_supply<CHRISTOKEN>(witness);

        transfer::share_object(Reserve {
            id: object::new(ctx),
            total_supply,
        })
    }

    public entry fun mint(reserve: &mut Reserve, ctx: &mut TxContext) {
        let minted_balance = balance::increase_supply(&mut reserve.total_supply, 10000);
        transfer::transfer(coin::from_balance(minted_balance, ctx), tx_context::sender(ctx))
    }
}