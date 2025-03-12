alter table "public"."spotify_tracks" drop column if exists "pupularity";

alter table "public"."spotify_tracks" ADD COLUMN IF NOT EXISTS "popularity" bigint default '0'::bigint;
