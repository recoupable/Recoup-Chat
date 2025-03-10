set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_campaign_fans(artistid text, email text)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$DECLARE
    artist_ids UUID[];
BEGIN
    artist_ids := ARRAY[]::UUID[];
    IF $1 IS NULL OR $1 = '' THEN
        SELECT ARRAY(
            SELECT (jsonb_array_elements_text("artistIds"))::UUID
            FROM "accounts" a
            WHERE a."email" = $2
        ) INTO artist_ids;
    ELSE
        SELECT ARRAY(SELECT id FROM "artists" WHERE "id" = $1::UUID) INTO artist_ids;
    END IF;

    RETURN (
        SELECT jsonb_build_object(
            'campaigns', (
                SELECT jsonb_agg(subquery)
                FROM (
                    SELECT
                        c.id,
                        c."clientId",
                        c."artistId",
                        c."timestamp",
                        (
                            SELECT jsonb_agg(jsonb_build_object(
                                'id', f.id,
                                'display_name', f.display_name,
                                'product', f.product,
                                'country', f.country,
                                'email', f.email,
                                'timestamp', f.timestamp
                            ))
                            FROM "fans" f
                            WHERE f."campaignId" = c."id"
                        ) AS fans
                    FROM "campaigns" c
                    WHERE c."artistId" = ANY(artist_ids)
                ) AS subquery
            )
        )
    );

END;$function$
;


