alter table "public"."funnel_analytics" drop constraint "funnel_analytics_artistId_fkey";

alter table "public"."funnel_analytics" add constraint "funnel_analytics_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES artists(id) ON DELETE CASCADE not valid;

alter table "public"."funnel_analytics" validate constraint "funnel_analytics_artistId_fkey";


