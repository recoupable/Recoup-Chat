-- Migration: Enable Row Level Security for youtube_tokens table
-- Only allow server keys (service_role) to read/write from the table
-- Block all anon access

-- Enable Row Level Security on the youtube_tokens table
ALTER TABLE "public"."youtube_tokens" ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to ensure clean state
DROP POLICY IF EXISTS "youtube_tokens_service_role_policy" ON "public"."youtube_tokens";

-- Create policy that only allows service_role access
-- This blocks anon users and regular authenticated users
-- Only server-side operations with service_role can access this table
CREATE POLICY "youtube_tokens_service_role_policy" 
    ON "public"."youtube_tokens"
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Explicitly deny access to anon role
-- This is redundant but makes the intent clear
CREATE POLICY "youtube_tokens_deny_anon" 
    ON "public"."youtube_tokens"
    FOR ALL 
    TO anon
    USING (false);

-- Explicitly deny access to authenticated role
-- Only service_role should have access
CREATE POLICY "youtube_tokens_deny_authenticated" 
    ON "public"."youtube_tokens"
    FOR ALL 
    TO authenticated
    USING (false);