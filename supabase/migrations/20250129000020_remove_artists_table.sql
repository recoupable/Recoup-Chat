revoke delete on table "public"."artists" from "anon";

revoke insert on table "public"."artists" from "anon";

revoke references on table "public"."artists" from "anon";

revoke select on table "public"."artists" from "anon";

revoke trigger on table "public"."artists" from "anon";

revoke truncate on table "public"."artists" from "anon";

revoke update on table "public"."artists" from "anon";

revoke delete on table "public"."artists" from "authenticated";

revoke insert on table "public"."artists" from "authenticated";

revoke references on table "public"."artists" from "authenticated";

revoke select on table "public"."artists" from "authenticated";

revoke trigger on table "public"."artists" from "authenticated";

revoke truncate on table "public"."artists" from "authenticated";

revoke update on table "public"."artists" from "authenticated";

revoke delete on table "public"."artists" from "service_role";

revoke insert on table "public"."artists" from "service_role";

revoke references on table "public"."artists" from "service_role";

revoke select on table "public"."artists" from "service_role";

revoke trigger on table "public"."artists" from "service_role";

revoke truncate on table "public"."artists" from "service_role";

revoke update on table "public"."artists" from "service_role";

alter table "public"."artists" drop constraint "artists_pkey";

drop index if exists "public"."artists_pkey";

drop table "public"."artists";

alter table "public"."funnel_analytics_profile" add constraint "funnel_analytics_profile_artist_id_fkey" FOREIGN KEY (artist_id) REFERENCES accounts(id) ON DELETE CASCADE not valid;

alter table "public"."funnel_analytics_profile" validate constraint "funnel_analytics_profile_artist_id_fkey";


