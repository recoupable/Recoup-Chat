-- Migration: Rename account_id to artist_account_id in youtube_tokens table
-- This migration renames the account_id column to artist_account_id while preserving 
-- all foreign key constraints, indexes, and unique constraints.

-- Step 1: Drop the existing foreign key constraint
ALTER TABLE "public"."youtube_tokens" 
    DROP CONSTRAINT IF EXISTS "youtube_tokens_account_id_fkey";

-- Step 2: Drop the existing unique constraint
ALTER TABLE "public"."youtube_tokens" 
    DROP CONSTRAINT IF EXISTS "youtube_tokens_account_id_key";

-- Step 3: Drop the existing index
DROP INDEX IF EXISTS "public"."youtube_tokens_account_id_idx";

-- Step 4: Rename the column
ALTER TABLE "public"."youtube_tokens" 
    RENAME COLUMN "account_id" TO "artist_account_id";

-- Step 5: Recreate the foreign key constraint with the new column name
ALTER TABLE "public"."youtube_tokens" 
    ADD CONSTRAINT "youtube_tokens_artist_account_id_fkey" 
    FOREIGN KEY ("artist_account_id") 
    REFERENCES "public"."accounts" ("id") 
    ON DELETE CASCADE;

-- Step 6: Recreate the unique constraint with the new column name
ALTER TABLE "public"."youtube_tokens" 
    ADD CONSTRAINT "youtube_tokens_artist_account_id_key" 
    UNIQUE ("artist_account_id");

-- Step 7: Recreate the index with the new column name
CREATE INDEX "youtube_tokens_artist_account_id_idx" 
    ON "public"."youtube_tokens" ("artist_account_id");