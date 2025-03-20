revoke delete on table "public"."fan_segment" from "anon";

revoke insert on table "public"."fan_segment" from "anon";

revoke references on table "public"."fan_segment" from "anon";

revoke select on table "public"."fan_segment" from "anon";

revoke trigger on table "public"."fan_segment" from "anon";

revoke truncate on table "public"."fan_segment" from "anon";

revoke update on table "public"."fan_segment" from "anon";

revoke delete on table "public"."fan_segment" from "authenticated";

revoke insert on table "public"."fan_segment" from "authenticated";

revoke references on table "public"."fan_segment" from "authenticated";

revoke select on table "public"."fan_segment" from "authenticated";

revoke trigger on table "public"."fan_segment" from "authenticated";

revoke truncate on table "public"."fan_segment" from "authenticated";

revoke update on table "public"."fan_segment" from "authenticated";

revoke delete on table "public"."fan_segment" from "service_role";

revoke insert on table "public"."fan_segment" from "service_role";

revoke references on table "public"."fan_segment" from "service_role";

revoke select on table "public"."fan_segment" from "service_role";

revoke trigger on table "public"."fan_segment" from "service_role";

revoke truncate on table "public"."fan_segment" from "service_role";

revoke update on table "public"."fan_segment" from "service_role";

alter table "public"."fan_segment" drop constraint "fan_segment_account_id_fkey";

alter table "public"."fan_segment" drop constraint "fan_segment_artist_id_fkey";

alter table "public"."fan_segment" drop constraint "fan_segment_pkey";

drop index if exists "public"."fan_segment_pkey";

drop table "public"."fan_segment";

create table "public"."artist_fan_segment" (
    "updated_at" timestamp with time zone not null default now(),
    "artist_social_id" uuid default gen_random_uuid(),
    "fan_social_id" uuid default gen_random_uuid(),
    "id" uuid not null default gen_random_uuid()
);


alter table "public"."artist_fan_segment" enable row level security;

CREATE UNIQUE INDEX artist_fan_segment_pkey ON public.artist_fan_segment USING btree (id);

alter table "public"."artist_fan_segment" add constraint "artist_fan_segment_pkey" PRIMARY KEY using index "artist_fan_segment_pkey";

alter table "public"."artist_fan_segment" add constraint "artist_fan_segment_artist_social_id_fkey" FOREIGN KEY (artist_social_id) REFERENCES socials(id) ON DELETE CASCADE not valid;

alter table "public"."artist_fan_segment" validate constraint "artist_fan_segment_artist_social_id_fkey";

alter table "public"."artist_fan_segment" add constraint "artist_fan_segment_fan_social_id_fkey" FOREIGN KEY (fan_social_id) REFERENCES socials(id) ON DELETE CASCADE not valid;

alter table "public"."artist_fan_segment" validate constraint "artist_fan_segment_fan_social_id_fkey";

grant delete on table "public"."artist_fan_segment" to "anon";

grant insert on table "public"."artist_fan_segment" to "anon";

grant references on table "public"."artist_fan_segment" to "anon";

grant select on table "public"."artist_fan_segment" to "anon";

grant trigger on table "public"."artist_fan_segment" to "anon";

grant truncate on table "public"."artist_fan_segment" to "anon";

grant update on table "public"."artist_fan_segment" to "anon";

grant delete on table "public"."artist_fan_segment" to "authenticated";

grant insert on table "public"."artist_fan_segment" to "authenticated";

grant references on table "public"."artist_fan_segment" to "authenticated";

grant select on table "public"."artist_fan_segment" to "authenticated";

grant trigger on table "public"."artist_fan_segment" to "authenticated";

grant truncate on table "public"."artist_fan_segment" to "authenticated";

grant update on table "public"."artist_fan_segment" to "authenticated";

grant delete on table "public"."artist_fan_segment" to "service_role";

grant insert on table "public"."artist_fan_segment" to "service_role";

grant references on table "public"."artist_fan_segment" to "service_role";

grant select on table "public"."artist_fan_segment" to "service_role";

grant trigger on table "public"."artist_fan_segment" to "service_role";

grant truncate on table "public"."artist_fan_segment" to "service_role";

grant update on table "public"."artist_fan_segment" to "service_role";

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON artist_fan_segment
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at(); 