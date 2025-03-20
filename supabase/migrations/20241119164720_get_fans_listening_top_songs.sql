set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_fans_listening_top_songs(artistid text, email text)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$DECLARE
    artist_names TEXT[];
BEGIN
    IF $1 != '' THEN
        SELECT ARRAY(
            SELECT "name"
            FROM "artists" a
            WHERE a."id" = $1::UUID
        ) INTO artist_names;
    ELSE
        WITH artist_ids AS (
            SELECT (jsonb_array_elements_text("artistIds"))::UUID AS artist_id
            FROM "accounts" a
            WHERE a."email" = $2
        )
        SELECT ARRAY(
            SELECT "name"
            FROM "artists" a
            WHERE a."id" IN (SELECT artist_id FROM artist_ids)
        ) INTO artist_names;
    END IF;

    RETURN (
        SELECT jsonb_build_object(
            'fans', (
                SELECT jsonb_agg(subquery)
                FROM (
                    SELECT
                        f.display_name,
                        f.country,
                        f.email,
                        f.product,
                        f.timestamp,
                        (
                            SELECT jsonb_agg(rp)
                            FROM jsonb_array_elements(f."recentlyPlayed") AS rp
                            WHERE rp->>'artist' IN (SELECT unnest(artist_names))
                        ) AS recently_played_filtered
                    FROM "fans" f
                    WHERE EXISTS (
                        SELECT 1
                        FROM jsonb_array_elements(f."recentlyPlayed") AS rp
                        WHERE rp->>'artist' IN (SELECT unnest(artist_names))
                    )
                ) AS subquery
            )
        )
    );
END;$function$
;


