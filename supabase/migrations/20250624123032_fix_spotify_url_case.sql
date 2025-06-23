-- Fix case sensitivity for Spotify URLs

CREATE OR REPLACE FUNCTION clean_socials_profile_url()
RETURNS TRIGGER AS $$
BEGIN
  -- Strip protocol + www (case-insensitive)
  NEW.profile_url := regexp_replace(
    NEW.profile_url,
    '^(https?://)?(www\.)+',
    '',
    'i'
  );

  -- Remove trailing slashes
  NEW.profile_url := regexp_replace(NEW.profile_url, '/+$', '');

  -- Lower-case everything unless it starts with Spotify
  IF NEW.profile_url !~* '^(open\.)?spotify\.com/' THEN
    NEW.profile_url := lower(NEW.profile_url);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
