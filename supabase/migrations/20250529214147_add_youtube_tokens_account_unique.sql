-- Enforce global uniqueness for account_id in youtube_tokens table
ALTER TABLE youtube_tokens
    ADD CONSTRAINT youtube_tokens_account_id_key UNIQUE (account_id); 