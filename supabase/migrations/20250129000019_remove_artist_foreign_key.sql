alter table "public"."funnel_analytics_profile" drop constraint "funnel_analytics_profile_artistId_fkey";

alter table "public"."funnel_analytics_profile" drop column "artistId";

alter table "public"."funnel_analytics_profile" add column "artist_id" uuid default '00000000-0000-0000-0000-000000000000'::uuid;
