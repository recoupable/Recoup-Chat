-- Create YouTube tokens table for storing OAuth tokens per account
create table if not exists "public"."youtube_tokens" (
    "id" uuid not null default gen_random_uuid(),
    "account_id" uuid not null,
    "access_token" text not null,
    "refresh_token" text,
    "expires_at" timestamp with time zone not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    primary key ("id"),
    constraint "youtube_tokens_account_id_fkey" 
        foreign key ("account_id") 
        references "public"."accounts" ("id") 
        on delete cascade
);

-- Create index for faster lookups by account_id
create index if not exists "youtube_tokens_account_id_idx" 
    on "public"."youtube_tokens" ("account_id");

-- Create index for token expiry cleanup
create index if not exists "youtube_tokens_expires_at_idx" 
    on "public"."youtube_tokens" ("expires_at");

-- Drop trigger if it exists and recreate it
drop trigger if exists "youtube_tokens_updated_at_trigger" on "public"."youtube_tokens";

-- Add updated_at trigger using the correct function name
create trigger "youtube_tokens_updated_at_trigger"
    before update on "public"."youtube_tokens"
    for each row
    execute function trigger_set_updated_at(); 