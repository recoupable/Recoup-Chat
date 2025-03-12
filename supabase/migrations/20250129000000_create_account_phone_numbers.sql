DROP FUNCTION IF EXISTS public.trigger_set_timestamps();

CREATE OR REPLACE FUNCTION public.trigger_set_timestamps()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
    if TG_OP = 'INSERT' then
        new.created_at = now();

        new.updated_at = now();

    else
        new.updated_at = now();

        new.created_at = old.created_at;

    end if;

    return NEW;

end
$function$
;

-- Create account_phone_numbers table to establish relationship between accounts and phone numbers
CREATE TABLE IF NOT EXISTS account_phone_numbers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    phone_number VARCHAR(20) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(account_id, phone_number)
);

-- Create index on account_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_account_phone_numbers_account_id ON account_phone_numbers(account_id);

-- Create index on phone_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_account_phone_numbers_phone_number ON account_phone_numbers(phone_number);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON account_phone_numbers
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamps(); 