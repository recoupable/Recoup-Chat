-- Create account_wallets table
CREATE TABLE IF NOT EXISTS account_wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    wallet TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(account_id, wallet)
);

-- Create index on account_id for faster lookups
CREATE INDEX IF NOT EXISTS account_wallets_account_id_idx ON account_wallets(account_id);

-- Create index on wallet for faster lookups
CREATE INDEX IF NOT EXISTS account_wallets_wallet_idx ON account_wallets(wallet);

-- Create updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON account_wallets
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at(); 