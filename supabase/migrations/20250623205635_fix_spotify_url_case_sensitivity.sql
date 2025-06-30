-- Migration: Fix Spotify URL case sensitivity in socials.profile_url
-- This migration updates the clean_socials_profile_url trigger function to preserve
-- case sensitivity for Spotify URLs while maintaining existing cleaning behavior
-- for all other social platforms.

-- Update the cleaning function to preserve Spotify URL case sensitivity
CREATE OR REPLACE FUNCTION clean_socials_profile_url()
RETURNS TRIGGER AS $$
BEGIN
  -- Remove protocol (http://, https://) from the start
  NEW.profile_url := regexp_replace(NEW.profile_url, '^https?://', '');
  -- Remove leading www. from the start
  NEW.profile_url := regexp_replace(NEW.profile_url, '^www\.', '');
  -- Remove any trailing slash
  NEW.profile_url := regexp_replace(NEW.profile_url, '/+$', '');
  
  -- Convert to lowercase ONLY if URL does not contain 'spotify'
  -- This preserves case sensitivity for Spotify artist IDs
  IF NEW.profile_url NOT ILIKE '%spotify%' THEN
    NEW.profile_url := lower(NEW.profile_url);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;