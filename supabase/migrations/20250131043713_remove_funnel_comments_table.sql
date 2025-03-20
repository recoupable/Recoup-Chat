revoke delete on table "public"."funnel_analytics_comments" from "anon";

revoke insert on table "public"."funnel_analytics_comments" from "anon";

revoke references on table "public"."funnel_analytics_comments" from "anon";

revoke select on table "public"."funnel_analytics_comments" from "anon";

revoke trigger on table "public"."funnel_analytics_comments" from "anon";

revoke truncate on table "public"."funnel_analytics_comments" from "anon";

revoke update on table "public"."funnel_analytics_comments" from "anon";

revoke delete on table "public"."funnel_analytics_comments" from "authenticated";

revoke insert on table "public"."funnel_analytics_comments" from "authenticated";

revoke references on table "public"."funnel_analytics_comments" from "authenticated";

revoke select on table "public"."funnel_analytics_comments" from "authenticated";

revoke trigger on table "public"."funnel_analytics_comments" from "authenticated";

revoke truncate on table "public"."funnel_analytics_comments" from "authenticated";

revoke update on table "public"."funnel_analytics_comments" from "authenticated";

revoke delete on table "public"."funnel_analytics_comments" from "service_role";

revoke insert on table "public"."funnel_analytics_comments" from "service_role";

revoke references on table "public"."funnel_analytics_comments" from "service_role";

revoke select on table "public"."funnel_analytics_comments" from "service_role";

revoke trigger on table "public"."funnel_analytics_comments" from "service_role";

revoke truncate on table "public"."funnel_analytics_comments" from "service_role";

revoke update on table "public"."funnel_analytics_comments" from "service_role";

alter table "public"."funnel_analytics_comments" drop constraint "funnel_analysis_comments_analysis_id_fkey1";

alter table "public"."funnel_analytics_comments" drop constraint "funnel_analysis_comments_pkey1";

drop index if exists "public"."funnel_analysis_comments_pkey1";

drop table "public"."funnel_analytics_comments";


