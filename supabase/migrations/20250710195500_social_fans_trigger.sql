-- Migration: Create trigger to automatically update social_fans table when comments are added
-- This trigger will upsert records in social_fans whenever a comment is added to post_comments
-- Only updates if the new comment timestamp is newer than the existing latest_engagement

-- Create the trigger function
CREATE OR REPLACE FUNCTION update_social_fans_on_comment()
RETURNS TRIGGER AS $$
DECLARE
    v_artist_social_id UUID;
    v_existing_latest_engagement TIMESTAMPTZ;
BEGIN
    -- Get the artist's social_id from the post
    SELECT sp.social_id INTO v_artist_social_id
    FROM social_posts sp
    WHERE sp.post_id = NEW.post_id;
    
    -- If no artist found for this post, skip processing
    IF v_artist_social_id IS NULL THEN
        RETURN NEW;
    END IF;
    
    -- Don't process if fan and artist are the same (self-comment)
    IF NEW.social_id = v_artist_social_id THEN
        RETURN NEW;
    END IF;
    
    -- Check if there's an existing social_fans record
    SELECT latest_engagement INTO v_existing_latest_engagement
    FROM social_fans
    WHERE social_fans.artist_social_id = v_artist_social_id
    AND social_fans.fan_social_id = NEW.social_id;
    
    -- If no existing record OR new comment is newer, upsert the record
    IF v_existing_latest_engagement IS NULL OR NEW.commented_at > v_existing_latest_engagement THEN
        INSERT INTO social_fans (
            artist_social_id,
            fan_social_id,
            latest_engagement_id,
            latest_engagement,
            created_at,
            updated_at
        )
        VALUES (
            v_artist_social_id,
            NEW.social_id,
            NEW.id,
            NEW.commented_at,
            NOW(),
            NOW()
        )
        ON CONFLICT (artist_social_id, fan_social_id)
        DO UPDATE SET
            latest_engagement_id = NEW.id,
            latest_engagement = NEW.commented_at,
            updated_at = NOW()
        WHERE social_fans.latest_engagement < NEW.commented_at OR social_fans.latest_engagement IS NULL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger on post_comments table
DROP TRIGGER IF EXISTS trigger_update_social_fans_on_comment ON post_comments;
CREATE TRIGGER trigger_update_social_fans_on_comment
    AFTER INSERT OR UPDATE ON post_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_social_fans_on_comment();

-- Grant necessary permissions for the trigger function
GRANT EXECUTE ON FUNCTION update_social_fans_on_comment() TO anon;
GRANT EXECUTE ON FUNCTION update_social_fans_on_comment() TO authenticated;
GRANT EXECUTE ON FUNCTION update_social_fans_on_comment() TO service_role;