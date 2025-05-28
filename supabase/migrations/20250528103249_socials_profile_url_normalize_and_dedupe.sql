-- Migration: Normalize and deduplicate socials.profile_url
-- This migration normalizes all existing profile_url values in the socials table,
-- deletes duplicates, and updates references in account_socials and social_posts.

BEGIN;

-- 1. Create a temporary table to store duplicates info
CREATE TEMP TABLE social_duplicates AS
WITH normalized_urls AS (
  SELECT 
    id,
    lower(regexp_replace(
      regexp_replace(profile_url, '^(https?://)?(www\.?)+', ''),
      '/+$', ''
    )) as normalized_url
  FROM socials
),
duplicate_groups AS (
  SELECT 
    normalized_url,
    array_agg(id ORDER BY id) as id_array, -- Order by ID to keep consistent
    (array_agg(id ORDER BY id))[1] as keep_id -- Keep the earliest ID
  FROM normalized_urls
  GROUP BY normalized_url
  HAVING count(*) > 1
)
SELECT 
  normalized_url,
  keep_id,
  duplicate_id
FROM duplicate_groups,
LATERAL unnest(id_array) AS duplicate_id
WHERE duplicate_id != keep_id;

-- 2. Update references in account_socials
UPDATE account_socials AS a
SET social_id = d.keep_id
FROM social_duplicates AS d
WHERE a.social_id = d.duplicate_id;

-- 3. Update references in social_posts
UPDATE social_posts AS p
SET social_id = d.keep_id
FROM social_duplicates AS d
WHERE p.social_id = d.duplicate_id;

-- 4. Delete the duplicate social records
DELETE FROM socials
WHERE id IN (SELECT duplicate_id FROM social_duplicates);

-- 5. Now safely update all remaining records with normalized URLs
UPDATE socials SET profile_url = 
  lower(regexp_replace(
    regexp_replace(profile_url, '^(https?://)?(www\.?)+', ''),
    '/+$', ''
  ));

-- 6. Clean up temporary table
DROP TABLE social_duplicates;

COMMIT; 