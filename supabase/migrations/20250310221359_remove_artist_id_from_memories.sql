-- Migration: Remove artist_id from memories table
-- Description: This migration removes the artist_id column from the memories table
-- since this information is now stored in the rooms table.

-- First, drop the foreign key constraint if it exists
ALTER TABLE "public"."memories" DROP CONSTRAINT IF EXISTS "memories_artist_id_fkey";

-- Then remove the artist_id column from memories table
ALTER TABLE "public"."memories" DROP COLUMN IF EXISTS "artist_id";

-- DOWN migration
-- In case we need to rollback
-- ALTER TABLE "public"."memories" ADD COLUMN "artist_id" UUID DEFAULT NULL;
-- ALTER TABLE "public"."memories" ADD CONSTRAINT "memories_artist_id_fkey" 
--     FOREIGN KEY ("artist_id") REFERENCES "public"."accounts"("id") ON DELETE CASCADE NOT VALID;
-- ALTER TABLE "public"."memories" VALIDATE CONSTRAINT "memories_artist_id_fkey"; 