alter table "public"."artists" drop constraint "unique_artist_name";

drop index if exists "public"."unique_artist_name";

alter table "public"."artists" alter column "name" set data type text using "name"::text;


