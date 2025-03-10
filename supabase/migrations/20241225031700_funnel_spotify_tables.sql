alter table "public"."spotify_analytics_albums" add column "artist_name" text;
alter table "public"."spotify_analytics_albums" drop column if exists "popularity";
