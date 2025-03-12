drop function if exists "public"."get_campaign"(email text, artistid text, clientid text);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_campaign(email text, artistid text, campaignid text)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$DECLARE
    campaign_ids UUID[] := ARRAY[]::UUID[];
BEGIN
    IF $3 != '' THEN
        campaign_ids := ARRAY[$3];
    ELSIF  $2 != '' THEN 
        SELECT ARRAY(
            SELECT "id"::UUID
            FROM "campaigns" c
            WHERE c."artistId" = $2::UUID
        ) INTO campaign_ids;
    ELSE
        WITH artist_ids AS (
            SELECT (jsonb_array_elements_text("artistIds"))::UUID AS artist_id
            FROM "accounts" a
            WHERE a."email" = $1
        )
        SELECT ARRAY(
            SELECT "id"
            FROM "campaigns" c
            WHERE c."artistId" IN (SELECT artist_id FROM artist_ids)
        ) INTO campaign_ids;
    END IF;

    RETURN (
        SELECT jsonb_build_object(
            'genres', (
                SELECT jsonb_agg(genre_name ORDER BY popularity DESC) AS genre_names
                FROM (
                    SELECT DISTINCT
                        genre_element->>'name' AS genre_name,
                        (genre_element->>'popularity')::int AS popularity
                    FROM (
                        SELECT jsonb_array_elements("genres") AS genre_element
                        FROM "fans"
                        WHERE "campaignId" = ANY(campaign_ids)
                          AND "genres" IS NOT NULL
                          AND jsonb_typeof("genres") = 'array' -- Ensure it's an array
                    ) AS subquery
                    WHERE genre_element->>'name' IS NOT NULL
                ) AS unique_genres
            ),
            'albums', (
                SELECT jsonb_agg(album_name ORDER BY popularity DESC) AS album_names
                FROM (
                    SELECT DISTINCT
                        album_element->>'name' AS album_name,
                        (album_element->>'popularity')::int AS popularity
                    FROM (
                        SELECT jsonb_array_elements("savedAlbums") AS album_element
                        FROM "fans"
                        WHERE "campaignId" = ANY(campaign_ids)
                          AND "savedAlbums" IS NOT NULL
                          AND jsonb_typeof("savedAlbums") = 'array' -- Ensure it's an array
                    ) AS subquery
                    WHERE album_element->>'name' IS NOT NULL
                ) AS unique_albums
            ),
            'tracks', (
                SELECT jsonb_agg(track_name ORDER BY popularity DESC) AS track_names
                FROM (
                    SELECT DISTINCT
                        track_element->>'name' AS track_name,
                        (track_element->>'popularity')::int AS popularity
                    FROM (
                        SELECT jsonb_array_elements("topTracks") AS track_element
                        FROM "fans"
                        WHERE "campaignId" = ANY(campaign_ids)
                          AND "topTracks" IS NOT NULL
                          AND jsonb_typeof("topTracks") = 'array' -- Ensure it's an array
                        UNION ALL
                        SELECT jsonb_array_elements("savedTracks") AS track_element
                        FROM "fans"
                        WHERE "campaignId" = ANY(campaign_ids)
                          AND "savedTracks" IS NOT NULL
                          AND jsonb_typeof("savedTracks") = 'array' -- Ensure it's an array
                    ) AS track_subquery
                    WHERE track_element->>'name' IS NOT NULL
                ) AS unique_tracks
            ),
            'artists', (
                SELECT jsonb_agg(artist_name ORDER BY popularity DESC) AS artist_names
                FROM (
                    SELECT DISTINCT
                        artist_element->>'name' AS artist_name,
                        (artist_element->>'popularity')::int AS popularity
                    FROM (
                        SELECT jsonb_array_elements("followedArtists") AS artist_element
                        FROM "fans"
                        WHERE "campaignId" = ANY(campaign_ids)
                          AND "followedArtists" IS NOT NULL
                          AND jsonb_typeof("followedArtists") = 'array' -- Ensure it's an array
                        UNION ALL
                        SELECT jsonb_array_elements("topArtists") AS artist_element
                        FROM "fans"
                        WHERE "campaignId" = ANY(campaign_ids)
                          AND "topArtists" IS NOT NULL
                          AND jsonb_typeof("topArtists") = 'array' -- Ensure it's an array
                    ) AS artist_subquery
                    WHERE artist_element->>'name' IS NOT NULL
                ) AS unique_artists
            ),
            'audio_books', (
                SELECT jsonb_agg(audio_book_name::text) AS audio_book_names
                FROM (
                    SELECT DISTINCT
                        audio_book_element->>'name' AS audio_book_name
                    FROM (
                        SELECT jsonb_array_elements("savedAudioBooks") AS audio_book_element
                        FROM "fans"
                        WHERE "campaignId" = ANY(campaign_ids)
                          AND "savedAudioBooks" IS NOT NULL
                          AND jsonb_typeof("savedAudioBooks") = 'array' -- Ensure it's an array
                    ) AS subquery
                    WHERE audio_book_element->>'name' IS NOT NULL
                ) AS unique_audio_books
            ),
            'shows', (
                SELECT jsonb_agg(show_name::text) AS show_names
                FROM (
                    SELECT DISTINCT
                        show_element->>'name' AS show_name
                    FROM (
                        SELECT jsonb_array_elements("savedShows") AS show_element
                        FROM "fans"
                        WHERE "campaignId" = ANY(campaign_ids)
                          AND "savedShows" IS NOT NULL
                          AND jsonb_typeof("savedShows") = 'array' -- Ensure it's an array
                    ) AS subquery
                    WHERE show_element->>'name' IS NOT NULL
                ) AS unique_shows
            ),
            'playlist', (
                SELECT jsonb_agg(playlist_name::text) AS playlist_names
                FROM (
                    SELECT DISTINCT
                        playlist_element->>'name' AS playlist_name
                    FROM (
                        SELECT jsonb_array_elements("playlist") AS playlist_element
                        FROM "fans"
                        WHERE "campaignId" = ANY(campaign_ids)
                          AND "playlist" IS NOT NULL
                          AND jsonb_typeof("playlist") = 'array' -- Ensure it's an array
                    ) AS subquery
                    WHERE playlist_element->>'name' IS NOT NULL
                ) AS unique_playlists
            ),
            'episodes', (
                SELECT jsonb_agg(distinct jsonb_build_object(
                    'name', episodes_element->>'name',
                    'description', episodes_element->>'description'
                )) AS episodes_info
                FROM (
                    SELECT jsonb_array_elements("episodes") AS episodes_element
                    FROM "fans"
                    WHERE "campaignId" = ANY(campaign_ids)
                    AND "episodes" IS NOT NULL
                    AND jsonb_typeof("episodes") = 'array'
                ) AS subquery
                WHERE episodes_element->>'name' IS NOT NULL
            ),
            'fans', (
                SELECT jsonb_agg(subquery)
                FROM (
                     SELECT 
                        f.display_name, 
                        f.country, 
                        f.email, 
                        f.product
                    FROM "fans" f
                    WHERE f."campaignId" = ANY(campaign_ids)
                ) AS subquery
            )
        )
    );
END$function$
;


