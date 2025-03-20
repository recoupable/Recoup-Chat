create table "public"."socials" (
    "id" uuid not null default gen_random_uuid(),
    "username" text not null,
    "avatar" text,
    "profile_url" text not null,
    "region" text,
    "bio" text,
    "followerCount" bigint default '0'::bigint,
    "followingCount" bigint default '0'::bigint,
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."socials" enable row level security;

CREATE UNIQUE INDEX socials_pkey ON public.socials USING btree (id);

CREATE UNIQUE INDEX socials_profile_url_key ON public.socials USING btree (profile_url);

alter table "public"."socials" add constraint "socials_pkey" PRIMARY KEY using index "socials_pkey";

alter table "public"."socials" add constraint "socials_profile_url_key" UNIQUE using index "socials_profile_url_key";

alter table "public"."account_socials" add column "social_id" uuid not null default gen_random_uuid();

grant delete on table "public"."socials" to "anon";

grant insert on table "public"."socials" to "anon";

grant references on table "public"."socials" to "anon";

grant select on table "public"."socials" to "anon";

grant trigger on table "public"."socials" to "anon";

grant truncate on table "public"."socials" to "anon";

grant update on table "public"."socials" to "anon";

grant delete on table "public"."socials" to "authenticated";

grant insert on table "public"."socials" to "authenticated";

grant references on table "public"."socials" to "authenticated";

grant select on table "public"."socials" to "authenticated";

grant trigger on table "public"."socials" to "authenticated";

grant truncate on table "public"."socials" to "authenticated";

grant update on table "public"."socials" to "authenticated";

grant delete on table "public"."socials" to "service_role";

grant insert on table "public"."socials" to "service_role";

grant references on table "public"."socials" to "service_role";

grant select on table "public"."socials" to "service_role";

grant trigger on table "public"."socials" to "service_role";

grant truncate on table "public"."socials" to "service_role";

grant update on table "public"."socials" to "service_role";

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON socials
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at(); 


