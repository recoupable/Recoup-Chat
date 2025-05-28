-- Migration: Clean socials.profile_url (remove protocol, www, trailing slash, lowercase)
-- This migration creates a trigger to ensure all profile_url values in the socials table
-- have no protocol (http://, https://), no 'www' (with or without dot), no trailing '/', and are lowercase.

-- 1. Create the cleaning function
CREATE OR REPLACE FUNCTION clean_socials_profile_url()
RETURNS TRIGGER AS $$
BEGIN
  -- Remove protocol (http://, https://) and all www (with or without dot) from the start
  NEW.profile_url := regexp_replace(NEW.profile_url, '^(https?://)?(www\.?)+', '');
  -- Remove any trailing slash
  NEW.profile_url := regexp_replace(NEW.profile_url, '/+$', '');
  -- Convert to lowercase
  NEW.profile_url := lower(NEW.profile_url);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Create the trigger
DROP TRIGGER IF EXISTS trigger_clean_socials_profile_url ON socials;
CREATE TRIGGER trigger_clean_socials_profile_url
  BEFORE INSERT OR UPDATE ON socials
  FOR EACH ROW
  EXECUTE FUNCTION clean_socials_profile_url(); 