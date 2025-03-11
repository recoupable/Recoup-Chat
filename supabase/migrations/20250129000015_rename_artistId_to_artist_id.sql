alter table "public"."account_socials" drop constraint "artist_social_links_artistId_fkey";

alter table "public"."account_socials" drop column "artistId";

ALTER TABLE if exists "public"."campaigns" RENAME COLUMN "artistId" TO "artist_id";

alter table if exists "public"."campaigns" enable row level security;

ALTER TABLE if exists "public"."funnel_analytics" RENAME COLUMN "artistId" TO "artist_id";

