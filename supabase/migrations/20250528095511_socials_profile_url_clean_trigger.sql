-- Migration: Clean socials.profile_url (no www, no trailing slash)
-- This migration creates a trigger to ensure all profile_url values in the socials table
-- have no 'www.' and no trailing '/'.

-- 1. Create the cleaning function
CREATE OR REPLACE FUNCTION clean_socials_profile_url()
RETURNS TRIGGER AS $$
BEGIN
  -- Remove 'www.' from the start of the domain (if present)
  NEW.profile_url := regexp_replace(NEW.profile_url, '^(https?://)www\\.', '\1');
  -- Remove any trailing slash (but not from protocol)
  NEW.profile_url := regexp_replace(NEW.profile_url, '/+$', '');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Create the trigger
DROP TRIGGER IF EXISTS trigger_clean_socials_profile_url ON socials;
CREATE TRIGGER trigger_clean_socials_profile_url
  BEFORE INSERT OR UPDATE ON socials
  FOR EACH ROW
  EXECUTE FUNCTION clean_socials_profile_url(); 