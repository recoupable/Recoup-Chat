-- Enforce global uniqueness for wallet addresses in account_wallets
ALTER TABLE account_wallets
    ADD CONSTRAINT account_wallets_wallet_key UNIQUE (wallet); 