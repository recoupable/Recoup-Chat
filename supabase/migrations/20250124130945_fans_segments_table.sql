create table "public"."fans_segments" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "artistId" uuid default gen_random_uuid(),
    "handle" text,
    "email" text,
    "segment" text,
    "avatar" text,
    "bio" text,
    "followerCount" bigint default '0'::bigint
);


alter table "public"."fans_segments" enable row level security;

CREATE UNIQUE INDEX fans_segments_pkey ON public.fans_segments USING btree (id);

alter table "public"."fans_segments" add constraint "fans_segments_pkey" PRIMARY KEY using index "fans_segments_pkey";

alter table "public"."fans_segments" add constraint "fans_segments_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES artists(id) not valid;

alter table "public"."fans_segments" validate constraint "fans_segments_artistId_fkey";

grant delete on table "public"."fans_segments" to "anon";

grant insert on table "public"."fans_segments" to "anon";

grant references on table "public"."fans_segments" to "anon";

grant select on table "public"."fans_segments" to "anon";

grant trigger on table "public"."fans_segments" to "anon";

grant truncate on table "public"."fans_segments" to "anon";

grant update on table "public"."fans_segments" to "anon";

grant delete on table "public"."fans_segments" to "authenticated";

grant insert on table "public"."fans_segments" to "authenticated";

grant references on table "public"."fans_segments" to "authenticated";

grant select on table "public"."fans_segments" to "authenticated";

grant trigger on table "public"."fans_segments" to "authenticated";

grant truncate on table "public"."fans_segments" to "authenticated";

grant update on table "public"."fans_segments" to "authenticated";

grant delete on table "public"."fans_segments" to "service_role";

grant insert on table "public"."fans_segments" to "service_role";

grant references on table "public"."fans_segments" to "service_role";

grant select on table "public"."fans_segments" to "service_role";

grant trigger on table "public"."fans_segments" to "service_role";

grant truncate on table "public"."fans_segments" to "service_role";

grant update on table "public"."fans_segments" to "service_role";


