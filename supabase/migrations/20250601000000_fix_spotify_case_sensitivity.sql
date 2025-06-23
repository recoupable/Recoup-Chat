-- Migration: Fix case sensitivity for Spotify URLs
-- This migration addresses the issue where Spotify artist IDs were incorrectly lowercased
-- Spotify artist IDs are case-sensitive and need to preserve their original casing

BEGIN;

-- 1. Update the trigger function to preserve Spotify URL case sensitivity
CREATE OR REPLACE FUNCTION clean_socials_profile_url()
RETURNS TRIGGER AS $$
BEGIN
  -- Remove protocol (http://, https://) and all www (with or without dot) from the start
  NEW.profile_url := regexp_replace(NEW.profile_url, '^(https?://)?(www\.?)+', '');
  -- Remove any trailing slash
  NEW.profile_url := regexp_replace(NEW.profile_url, '/+$', '');
  -- Convert to lowercase ONLY if NOT a Spotify URL (preserve case for Spotify artist IDs)
  IF NEW.profile_url !~ '^(open\.)?spotify\.com/' THEN
    NEW.profile_url := lower(NEW.profile_url);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Note: Existing Spotify URLs that were incorrectly lowercased cannot be automatically fixed
-- because the original case information has been lost. These will need to be manually updated
-- or re-imported from the original source.

-- 3. Add a comment to document this issue for future reference
COMMENT ON FUNCTION clean_socials_profile_url() IS 
'Cleans profile URLs by removing protocols, www prefixes, and trailing slashes. 
Preserves case sensitivity for Spotify URLs to maintain valid artist IDs.
Note: Existing lowercased Spotify URLs may need manual correction.';

COMMIT; 