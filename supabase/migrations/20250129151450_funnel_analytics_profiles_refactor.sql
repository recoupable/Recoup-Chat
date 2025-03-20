revoke delete on table "public"."funnel_analytics_profile" from "anon";

revoke insert on table "public"."funnel_analytics_profile" from "anon";

revoke references on table "public"."funnel_analytics_profile" from "anon";

revoke select on table "public"."funnel_analytics_profile" from "anon";

revoke trigger on table "public"."funnel_analytics_profile" from "anon";

revoke truncate on table "public"."funnel_analytics_profile" from "anon";

revoke update on table "public"."funnel_analytics_profile" from "anon";

revoke delete on table "public"."funnel_analytics_profile" from "authenticated";

revoke insert on table "public"."funnel_analytics_profile" from "authenticated";

revoke references on table "public"."funnel_analytics_profile" from "authenticated";

revoke select on table "public"."funnel_analytics_profile" from "authenticated";

revoke trigger on table "public"."funnel_analytics_profile" from "authenticated";

revoke truncate on table "public"."funnel_analytics_profile" from "authenticated";

revoke update on table "public"."funnel_analytics_profile" from "authenticated";

revoke delete on table "public"."funnel_analytics_profile" from "service_role";

revoke insert on table "public"."funnel_analytics_profile" from "service_role";

revoke references on table "public"."funnel_analytics_profile" from "service_role";

revoke select on table "public"."funnel_analytics_profile" from "service_role";

revoke trigger on table "public"."funnel_analytics_profile" from "service_role";

revoke truncate on table "public"."funnel_analytics_profile" from "service_role";

revoke update on table "public"."funnel_analytics_profile" from "service_role";

alter table "public"."funnel_analytics_profile" drop constraint "funnel_analysis_comments_analysis_id_fkey";

alter table "public"."funnel_analytics_profile" drop constraint "funnel_analytics_profile_artist_id_fkey";

alter table "public"."funnel_analytics_profile" drop constraint "funnel_analysis_comments_pkey";

drop index if exists "public"."funnel_analysis_comments_pkey";

drop table "public"."funnel_analytics_profile";

alter table "public"."account_socials" add column "avatar" text;

alter table "public"."account_socials" add column "bio" text;

alter table "public"."account_socials" add column "followerCount" text;

alter table "public"."account_socials" add column "followingCount" text;

alter table "public"."account_socials" add column "region" text;

alter table "public"."account_socials" add column "username" text;


