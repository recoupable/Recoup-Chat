-- Migration: Deduplicate and enforce uniqueness on social_posts (post_id, social_id)
-- Deletes all but one row for each (post_id, social_id) pair, then adds a unique constraint.

BEGIN;

-- 1. Remove duplicates, keeping the row with the lowest id for each (post_id, social_id)
WITH ranked AS (
  SELECT id, post_id, social_id,
         ROW_NUMBER() OVER (PARTITION BY post_id, social_id ORDER BY updated_at ASC NULLS LAST, id ASC) AS rn
  FROM social_posts
)
DELETE FROM social_posts
WHERE id IN (
  SELECT id FROM ranked WHERE rn > 1
);

-- 2. Add a unique constraint to prevent future duplicates
CREATE UNIQUE INDEX IF NOT EXISTS social_posts_post_id_social_id_unique
  ON public.social_posts (post_id, social_id);

COMMIT;