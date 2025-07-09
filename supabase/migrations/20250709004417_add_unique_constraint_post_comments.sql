-- Migration: Add unique constraint to post_comments table
-- Description: Enforce uniqueness for the combination of post_id, social_id, comment, and commented_at
-- to prevent duplicate comment entries

-- First, remove any existing duplicate records (keeping the one with the earliest id)
-- This step is necessary before adding the unique constraint
DELETE FROM "public"."post_comments" 
WHERE "id" NOT IN (
    SELECT MIN("id") 
    FROM "public"."post_comments" 
    GROUP BY "post_id", "social_id", "comment", "commented_at"
);

-- Create a unique index for the combination of columns
CREATE UNIQUE INDEX IF NOT EXISTS "post_comments_unique_combination_idx" 
ON "public"."post_comments" ("post_id", "social_id", "comment", "commented_at");

-- Add the unique constraint using the index
ALTER TABLE "public"."post_comments" 
ADD CONSTRAINT "post_comments_unique_combination" 
UNIQUE USING INDEX "post_comments_unique_combination_idx";