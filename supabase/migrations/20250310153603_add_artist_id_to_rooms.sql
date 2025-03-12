-- Migration: Add artist_id to rooms table and migrate data from memories table
-- Description: This migration adds an artist_id column to the rooms table,
-- populates it with values from the memories table, and then removes the artist_id column from memories.

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

-- Add foreign key constraint to artist_id in rooms table
ALTER TABLE "public"."rooms" ADD CONSTRAINT "rooms_artist_id_fkey" 
    FOREIGN KEY ("artist_id") REFERENCES "public"."accounts"("id") ON DELETE CASCADE NOT VALID;
ALTER TABLE "public"."rooms" VALIDATE CONSTRAINT "rooms_artist_id_fkey";

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS "idx_rooms_artist_id" ON "public"."rooms" ("artist_id");

-- Remove artist_id from memories table
-- First drop the foreign key constraint
ALTER TABLE "public"."memories" DROP CONSTRAINT IF EXISTS "memories_artist_id_fkey";

-- Then drop the column
ALTER TABLE "public"."memories" DROP COLUMN "artist_id";

-- DOWN migration
-- In case we need to rollback
-- First recreate the artist_id column in memories
-- ALTER TABLE "public"."memories" ADD COLUMN "artist_id" UUID DEFAULT NULL;
-- ALTER TABLE "public"."memories" ADD CONSTRAINT "memories_artist_id_fkey" 
--     FOREIGN KEY ("artist_id") REFERENCES "public"."accounts"("id") ON DELETE CASCADE;
-- Migrate data back from rooms to memories
-- CREATE OR REPLACE FUNCTION migrate_artist_id_to_memories()
-- RETURNS void AS $$
-- BEGIN
--     UPDATE "public"."memories" m
--     SET "artist_id" = (
--         SELECT "artist_id"
--         FROM "public"."rooms" r
--         WHERE r."id" = m."room_id"
--     )
--     WHERE EXISTS (
--         SELECT 1
--         FROM "public"."rooms" r
--         WHERE r."id" = m."room_id"
--     );
-- END;
-- $$ LANGUAGE plpgsql;
-- SELECT migrate_artist_id_to_memories();
-- DROP FUNCTION migrate_artist_id_to_memories();
-- Then remove from rooms
-- DROP INDEX IF EXISTS "public"."idx_rooms_artist_id";
-- ALTER TABLE "public"."rooms" DROP CONSTRAINT IF EXISTS "rooms_artist_id_fkey";
-- ALTER TABLE "public"."rooms" DROP COLUMN IF EXISTS "artist_id"; 