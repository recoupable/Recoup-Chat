ALTER TABLE "public"."fans"
DROP COLUMN "episodes";

ALTER TABLE "public"."fans"
RENAME COLUMN "episodes_copy" TO "episodes"; 
