-- Create YouTube tokens table for storing OAuth tokens per account
CREATE TABLE IF NOT EXISTS "public"."youtube_tokens" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "account_id" uuid NOT NULL,
    "access_token" text NOT NULL,
    "refresh_token" text,
    "expires_at" timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY ("id"),
    CONSTRAINT "youtube_tokens_account_id_fkey" 
        FOREIGN KEY ("account_id") 
        REFERENCES "public"."accounts" ("id") 
        ON DELETE CASCADE,
    CONSTRAINT "youtube_tokens_account_id_key" 
        UNIQUE ("account_id")
);

-- Create index for faster lookups by account_id
CREATE INDEX IF NOT EXISTS "youtube_tokens_account_id_idx" 
    ON "public"."youtube_tokens" ("account_id");

-- Create index for token expiry cleanup
CREATE INDEX IF NOT EXISTS "youtube_tokens_expires_at_idx" 
    ON "public"."youtube_tokens" ("expires_at");

-- Add updated_at trigger
DO $$ 
BEGIN
    -- Drop trigger if it exists
    DROP TRIGGER IF EXISTS "youtube_tokens_updated_at_trigger" ON "public"."youtube_tokens";
    
    -- Create the trigger
    CREATE TRIGGER "youtube_tokens_updated_at_trigger"
        BEFORE UPDATE ON "public"."youtube_tokens"
        FOR EACH ROW
        EXECUTE FUNCTION trigger_set_updated_at();
END $$; 