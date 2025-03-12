alter table if exists "public"."campaigns" add constraint "campaigns_artist_id_fkey" FOREIGN KEY (artist_id) REFERENCES accounts(id) ON DELETE CASCADE not valid;

alter table if exists "public"."campaigns" validate constraint "campaigns_artist_id_fkey";

alter table "public"."funnel_analytics" add constraint "funnel_analytics_artist_id_fkey" FOREIGN KEY (artist_id) REFERENCES accounts(id) ON DELETE CASCADE not valid;

alter table "public"."funnel_analytics" validate constraint "funnel_analytics_artist_id_fkey";


