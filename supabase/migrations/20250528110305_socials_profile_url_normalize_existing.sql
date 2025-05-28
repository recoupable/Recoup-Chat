-- Migration: Normalize all existing socials.profile_url to match trigger logic
-- This migration updates all existing profile_url values in the socials table
-- to remove protocol, leading www., trailing slashes, and lowercase.

UPDATE socials
SET profile_url = lower(
  regexp_replace(
    regexp_replace(
      regexp_replace(profile_url, '^https?://', ''),
      '^www\.', ''
    ),
    '/+$', ''
  )
); 