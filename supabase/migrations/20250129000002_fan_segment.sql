create table "public"."fan_segment" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "account_id" uuid default gen_random_uuid(),
    "artist_id" uuid default gen_random_uuid(),
    "segment_name" text
);


alter table "public"."fan_segment" enable row level security;

CREATE UNIQUE INDEX fan_segment_pkey ON public.fan_segment USING btree (id);

alter table "public"."fan_segment" add constraint "fan_segment_pkey" PRIMARY KEY using index "fan_segment_pkey";

alter table "public"."fan_segment" add constraint "fan_segment_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(id) not valid;

alter table "public"."fan_segment" validate constraint "fan_segment_account_id_fkey";

alter table "public"."fan_segment" add constraint "fan_segment_artist_id_fkey" FOREIGN KEY (artist_id) REFERENCES artists(id) not valid;

alter table "public"."fan_segment" validate constraint "fan_segment_artist_id_fkey";

grant delete on table "public"."fan_segment" to "anon";

grant insert on table "public"."fan_segment" to "anon";

grant references on table "public"."fan_segment" to "anon";

grant select on table "public"."fan_segment" to "anon";

grant trigger on table "public"."fan_segment" to "anon";

grant truncate on table "public"."fan_segment" to "anon";

grant update on table "public"."fan_segment" to "anon";

grant delete on table "public"."fan_segment" to "authenticated";

grant insert on table "public"."fan_segment" to "authenticated";

grant references on table "public"."fan_segment" to "authenticated";

grant select on table "public"."fan_segment" to "authenticated";

grant trigger on table "public"."fan_segment" to "authenticated";

grant truncate on table "public"."fan_segment" to "authenticated";

grant update on table "public"."fan_segment" to "authenticated";

grant delete on table "public"."fan_segment" to "service_role";

grant insert on table "public"."fan_segment" to "service_role";

grant references on table "public"."fan_segment" to "service_role";

grant select on table "public"."fan_segment" to "service_role";

grant trigger on table "public"."fan_segment" to "service_role";

grant truncate on table "public"."fan_segment" to "service_role";

grant update on table "public"."fan_segment" to "service_role";


