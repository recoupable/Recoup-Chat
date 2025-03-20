alter table "public"."account_socials" drop constraint "artist_social_links_pkey";

drop index if exists "public"."artist_social_links_pkey";

alter table "public"."account_socials" drop column "id";