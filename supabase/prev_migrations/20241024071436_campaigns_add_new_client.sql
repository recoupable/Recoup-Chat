ALTER TABLE artists
DROP CONSTRAINT IF EXISTS unique_artist_name;

ALTER TABLE artists
ADD CONSTRAINT unique_artist_name UNIQUE ("name");

WITH artist_id AS (
    INSERT INTO artists ("name")
    VALUES ('Megan Thee Stallion')
    ON CONFLICT ("name") DO NOTHING
    RETURNING "id"
)

INSERT INTO campaigns ("artistId", "clientId")
VALUES (
    (SELECT "id" FROM artist_id
     UNION ALL
     SELECT "id" FROM artists WHERE "name" = 'Megan Thee Stallion'
     LIMIT 1),
    'MEGAN_ACT_II'
);