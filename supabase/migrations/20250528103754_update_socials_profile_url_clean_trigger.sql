-- Migration: Update clean_socials_profile_url trigger function
-- This migration updates the trigger function to ensure all profile_url values in the socials table
-- have no protocol (http://, https://), no 'www.' at the start, no trailing '/', and are lowercase.

-- 1. Update the cleaning function
CREATE OR REPLACE FUNCTION clean_socials_profile_url()
RETURNS TRIGGER AS $$
BEGIN
  -- Remove protocol (http://, https://) from the start
  NEW.profile_url := regexp_replace(NEW.profile_url, '^https?://', '');
  -- Remove leading www. from the start
  NEW.profile_url := regexp_replace(NEW.profile_url, '^www\.', '');
  -- Remove any trailing slash
  NEW.profile_url := regexp_replace(NEW.profile_url, '/+$', '');
  -- Convert to lowercase
  NEW.profile_url := lower(NEW.profile_url);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql; 