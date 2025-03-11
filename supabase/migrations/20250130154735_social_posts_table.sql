create table "public"."social_posts" (
    "id" uuid not null default gen_random_uuid(),
    "updated_at" timestamp with time zone,
    "account_social_id" uuid default gen_random_uuid(),
    "post_url" text
);


alter table "public"."social_posts" enable row level security;

CREATE UNIQUE INDEX social_posts_pkey ON public.social_posts USING btree (id);

alter table "public"."social_posts" add constraint "social_posts_pkey" PRIMARY KEY using index "social_posts_pkey";

alter table "public"."social_posts" add constraint "social_posts_account_social_id_fkey" FOREIGN KEY (account_social_id) REFERENCES account_socials(id) ON DELETE CASCADE not valid;

alter table "public"."social_posts" validate constraint "social_posts_account_social_id_fkey";

grant delete on table "public"."social_posts" to "anon";

grant insert on table "public"."social_posts" to "anon";

grant references on table "public"."social_posts" to "anon";

grant select on table "public"."social_posts" to "anon";

grant trigger on table "public"."social_posts" to "anon";

grant truncate on table "public"."social_posts" to "anon";

grant update on table "public"."social_posts" to "anon";

grant delete on table "public"."social_posts" to "authenticated";

grant insert on table "public"."social_posts" to "authenticated";

grant references on table "public"."social_posts" to "authenticated";

grant select on table "public"."social_posts" to "authenticated";

grant trigger on table "public"."social_posts" to "authenticated";

grant truncate on table "public"."social_posts" to "authenticated";

grant update on table "public"."social_posts" to "authenticated";

grant delete on table "public"."social_posts" to "service_role";

grant insert on table "public"."social_posts" to "service_role";

grant references on table "public"."social_posts" to "service_role";

grant select on table "public"."social_posts" to "service_role";

grant trigger on table "public"."social_posts" to "service_role";

grant truncate on table "public"."social_posts" to "service_role";

grant update on table "public"."social_posts" to "service_role";

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON social_posts
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at(); 

