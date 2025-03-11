-- Migration: Add artist_id to rooms table and migrate data from memories table
-- Description: This migration adds an artist_id column to the rooms table and
-- populates it with values from the memories table where available.

-- Add artist_id column to rooms table
ALTER TABLE "public"."rooms" ADD COLUMN "artist_id" UUID DEFAULT NULL;

-- Create a temporary function to migrate the data
CREATE OR REPLACE FUNCTION migrate_artist_id_to_rooms()
RETURNS void AS $$
BEGIN
    -- Update rooms with artist_id from memories
    -- For each room, find the artist_id from any memory in that room
    UPDATE "public"."rooms" r
    SET "artist_id" = (
        SELECT "artist_id"
        FROM "public"."memories" m
        WHERE m."room_id" = r."id"
        LIMIT 1
    )
    WHERE EXISTS (
        SELECT 1
        FROM "public"."memories" m
        WHERE m."room_id" = r."id"
    );
END;
$$ LANGUAGE plpgsql;

-- Execute the migration function
SELECT migrate_artist_id_to_rooms();

-- Drop the temporary function
DROP FUNCTION migrate_artist_id_to_rooms();

-- Add foreign key constraint to artist_id
ALTER TABLE "public"."rooms" ADD CONSTRAINT "rooms_artist_id_fkey" 
    FOREIGN KEY ("artist_id") REFERENCES "public"."accounts"("id") ON DELETE CASCADE NOT VALID;
ALTER TABLE "public"."rooms" VALIDATE CONSTRAINT "rooms_artist_id_fkey";

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS "idx_rooms_artist_id" ON "public"."rooms" ("artist_id");

-- DOWN migration
-- In case we need to rollback
-- DROP INDEX IF EXISTS "public"."idx_rooms_artist_id";
-- ALTER TABLE "public"."rooms" DROP CONSTRAINT IF EXISTS "rooms_artist_id_fkey";
-- ALTER TABLE "public"."rooms" DROP COLUMN IF EXISTS "artist_id"; 