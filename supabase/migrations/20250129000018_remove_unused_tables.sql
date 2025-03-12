revoke delete on table "public"."fans_segments" from "anon";

revoke insert on table "public"."fans_segments" from "anon";

revoke references on table "public"."fans_segments" from "anon";

revoke select on table "public"."fans_segments" from "anon";

revoke trigger on table "public"."fans_segments" from "anon";

revoke truncate on table "public"."fans_segments" from "anon";

revoke update on table "public"."fans_segments" from "anon";

revoke delete on table "public"."fans_segments" from "authenticated";

revoke insert on table "public"."fans_segments" from "authenticated";

revoke references on table "public"."fans_segments" from "authenticated";

revoke select on table "public"."fans_segments" from "authenticated";

revoke trigger on table "public"."fans_segments" from "authenticated";

revoke truncate on table "public"."fans_segments" from "authenticated";

revoke update on table "public"."fans_segments" from "authenticated";

revoke delete on table "public"."fans_segments" from "service_role";

revoke insert on table "public"."fans_segments" from "service_role";

revoke references on table "public"."fans_segments" from "service_role";

revoke select on table "public"."fans_segments" from "service_role";

revoke trigger on table "public"."fans_segments" from "service_role";

revoke truncate on table "public"."fans_segments" from "service_role";

revoke update on table "public"."fans_segments" from "service_role";

revoke delete on table "public"."tiktok_analysis" from "anon";

revoke insert on table "public"."tiktok_analysis" from "anon";

revoke references on table "public"."tiktok_analysis" from "anon";

revoke select on table "public"."tiktok_analysis" from "anon";

revoke trigger on table "public"."tiktok_analysis" from "anon";

revoke truncate on table "public"."tiktok_analysis" from "anon";

revoke update on table "public"."tiktok_analysis" from "anon";

revoke delete on table "public"."tiktok_analysis" from "authenticated";

revoke insert on table "public"."tiktok_analysis" from "authenticated";

revoke references on table "public"."tiktok_analysis" from "authenticated";

revoke select on table "public"."tiktok_analysis" from "authenticated";

revoke trigger on table "public"."tiktok_analysis" from "authenticated";

revoke truncate on table "public"."tiktok_analysis" from "authenticated";

revoke update on table "public"."tiktok_analysis" from "authenticated";

revoke delete on table "public"."tiktok_analysis" from "service_role";

revoke insert on table "public"."tiktok_analysis" from "service_role";

revoke references on table "public"."tiktok_analysis" from "service_role";

revoke select on table "public"."tiktok_analysis" from "service_role";

revoke trigger on table "public"."tiktok_analysis" from "service_role";

revoke truncate on table "public"."tiktok_analysis" from "service_role";

revoke update on table "public"."tiktok_analysis" from "service_role";

alter table "public"."fans_segments" drop constraint "fans_segments_artistId_fkey";

alter table "public"."tiktok_analysis" drop constraint "tiktok_analysis_artistId_fkey";

alter table "public"."fans_segments" drop constraint "fans_segments_pkey";

alter table "public"."tiktok_analysis" drop constraint "tiktok_analysis_pkey";

drop index if exists "public"."fans_segments_pkey";

drop index if exists "public"."tiktok_analysis_pkey";

drop table "public"."fans_segments";

drop table "public"."tiktok_analysis";

drop table "public"."tiktok_reports";
