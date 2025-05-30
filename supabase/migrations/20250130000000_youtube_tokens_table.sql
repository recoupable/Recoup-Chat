-- Create YouTube tokens table for storing OAuth tokens per artist
create table if not exists "public"."youtube_tokens" (
    "id" uuid not null default gen_random_uuid(),
    "artist_id" uuid not null,
    "access_token" text not null,
    "refresh_token" text,
    "expires_at" timestamp with time zone not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    primary key ("id"),
    constraint "youtube_tokens_artist_id_fkey" 
        foreign key ("artist_id") 
        references "public"."accounts" ("id") 
        on delete cascade
);

-- Create unique index to ensure one YouTube token per artist
create unique index if not exists "youtube_tokens_artist_id_unique" 
    on "public"."youtube_tokens" ("artist_id");

-- Create index for faster lookups by artist_id
create index if not exists "youtube_tokens_artist_id_idx" 
    on "public"."youtube_tokens" ("artist_id");

-- Create index for token expiry cleanup
create index if not exists "youtube_tokens_expires_at_idx" 
    on "public"."youtube_tokens" ("expires_at");

-- Add updated_at trigger using the correct function name
create trigger "youtube_tokens_updated_at_trigger"
    before update on "public"."youtube_tokens"
    for each row
    execute function trigger_set_updated_at(); 