-- Create segments table to store segment definitions
CREATE TABLE IF NOT EXISTS segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create artist_segments table to establish relationship between artists and segments
CREATE TABLE IF NOT EXISTS artist_segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    segment_id UUID NOT NULL REFERENCES segments(id) ON DELETE CASCADE,
    artist_account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(segment_id, artist_account_id)
);

-- Create fan_segments table to establish relationship between fans and segments
CREATE TABLE IF NOT EXISTS fan_segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    segment_id UUID NOT NULL REFERENCES segments(id) ON DELETE CASCADE,
    fan_social_id UUID NOT NULL REFERENCES socials(id) ON DELETE CASCADE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(segment_id, fan_social_id)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_segments_name ON segments(name);
CREATE INDEX IF NOT EXISTS idx_artist_segments_segment_id ON artist_segments(segment_id);
CREATE INDEX IF NOT EXISTS idx_artist_segments_artist_account_id ON artist_segments(artist_account_id);
CREATE INDEX IF NOT EXISTS idx_fan_segments_segment_id ON fan_segments(segment_id);
CREATE INDEX IF NOT EXISTS idx_fan_segments_fan_social_id ON fan_segments(fan_social_id);

-- Add triggers to update updated_at timestamp
CREATE TRIGGER set_timestamp_segments
    BEFORE UPDATE ON segments
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamps();

CREATE TRIGGER set_timestamp_artist_segments
    BEFORE UPDATE ON artist_segments
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamps();

CREATE TRIGGER set_timestamp_fan_segments
    BEFORE UPDATE ON fan_segments
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamps();

-- DOWN migration
-- Drop tables in reverse order to handle dependencies
-- DROP TRIGGER IF EXISTS set_timestamp_fan_segments ON fan_segments;
-- DROP TRIGGER IF EXISTS set_timestamp_artist_segments ON artist_segments;
-- DROP TRIGGER IF EXISTS set_timestamp_segments ON segments;

-- DROP TABLE IF EXISTS fan_segments;
-- DROP TABLE IF EXISTS artist_segments;
-- DROP TABLE IF EXISTS segments; 