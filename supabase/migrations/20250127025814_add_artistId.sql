alter table "public"."funnel_analytics" add column "artistId" uuid default '00000000-0000-0000-0000-000000000000'::uuid;

alter table "public"."funnel_analytics" add constraint "funnel_analytics_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES artists(id) not valid;

alter table "public"."funnel_analytics" validate constraint "funnel_analytics_artistId_fkey";
