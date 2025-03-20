alter table "public"."funnel_analytics_profile" add column "artistId" uuid default '00000000-0000-0000-0000-000000000000'::uuid;

alter table "public"."funnel_analytics_profile" add constraint "funnel_analytics_profile_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES artists(id) ON DELETE CASCADE not valid;

alter table "public"."funnel_analytics_profile" validate constraint "funnel_analytics_profile_artistId_fkey";


