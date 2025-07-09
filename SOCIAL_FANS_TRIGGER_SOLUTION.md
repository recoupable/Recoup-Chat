# Social Fans Trigger Solution

## Overview
This solution implements a Supabase trigger that automatically manages the `social_fans` table whenever new comments are added to the `post_comments` table. The trigger ensures that fan engagement data is automatically tracked and maintained.

## Problem Statement
- **Issue**: The `social_fans` table was empty despite comments being added to `post_comments`
- **Requirement**: Automatically upsert records in `social_fans` when comments are added
- **Logic**: Only update if the new comment timestamp is newer than existing `latest_engagement`

## Database Relationships
The trigger works by following these relationships:

1. **Comment to Artist**: `post_comments.post_id` → `social_posts.post_id` → `social_posts.social_id` (artist's social)
2. **Comment to Fan**: `post_comments.social_id` (fan's social)

## Solution Details

### Trigger Function: `update_social_fans_on_comment()`

The function performs these steps:

1. **Find Artist**: Queries `social_posts` to find the artist's social_id from the post
2. **Validation**: Skips processing if:
   - No artist found for the post
   - Fan and artist are the same (self-comment)
3. **Check Existing**: Looks for existing `social_fans` record for this artist-fan pair
4. **Conditional Upsert**: Only updates if:
   - No existing record exists, OR
   - New comment timestamp is newer than existing `latest_engagement`

### Key Features

- **Timestamp Validation**: Prevents older comments from overwriting newer engagement data
- **Self-Comment Protection**: Ignores comments from artists on their own posts
- **Efficient Upsert**: Uses PostgreSQL's `ON CONFLICT` with conditional updates
- **Proper Indexing**: Leverages existing unique constraint on `(artist_social_id, fan_social_id)`

## Migration File
Created: `supabase/migrations/20250710000000_social_fans_trigger.sql`

## Trigger Details
- **Trigger Name**: `trigger_update_social_fans_on_comment`
- **Event**: `AFTER INSERT OR UPDATE` on `post_comments`
- **Scope**: `FOR EACH ROW`

## Testing
The trigger will automatically activate once the migration is applied. When new comments are inserted or updated in `post_comments`, the `social_fans` table will be automatically maintained.

## Benefits
1. **Automated**: No manual intervention required
2. **Accurate**: Respects timestamp ordering
3. **Efficient**: Only processes valid artist-fan relationships
4. **Scalable**: Handles high-volume comment scenarios

## Migration Application
To apply this migration to your Supabase instance:

```bash
# If using Supabase CLI locally
supabase db reset

# Or apply via Supabase dashboard
# Upload the migration file through the SQL editor
```