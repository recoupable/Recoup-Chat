ALTER TABLE "public"."fans"
ADD COLUMN "episodes_copy" jsonb;

UPDATE "public"."fans"
SET "episodes_copy" = (
    SELECT jsonb_agg(elem)
    FROM unnest(episodes) AS elem
);


