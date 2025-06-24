create table "public"."social_fans" (
    "id" uuid not null default gen_random_uuid(),
    "artist_social_id" uuid not null,
    "fan_social_id" uuid not null,
    "latest_engagement_id" uuid,
    "latest_engagement" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);

alter table "public"."social_fans" enable row level security;

CREATE UNIQUE INDEX social_fans_pkey ON public.social_fans USING btree (id);

-- Create a unique constraint to prevent duplicate artist-fan relationships
CREATE UNIQUE INDEX social_fans_artist_fan_unique ON public.social_fans USING btree (artist_social_id, fan_social_id);

-- Index for efficient queries by artist
CREATE INDEX social_fans_artist_social_id_idx ON public.social_fans USING btree (artist_social_id);

-- Index for efficient queries by fan
CREATE INDEX social_fans_fan_social_id_idx ON public.social_fans USING btree (fan_social_id);

-- Index for efficient queries by latest engagement date
CREATE INDEX social_fans_latest_engagement_idx ON public.social_fans USING btree (latest_engagement);

alter table "public"."social_fans" add constraint "social_fans_pkey" PRIMARY KEY using index "social_fans_pkey";

alter table "public"."social_fans" add constraint "social_fans_artist_fan_unique" UNIQUE using index "social_fans_artist_fan_unique";

-- Foreign key constraints
alter table "public"."social_fans" add constraint "social_fans_artist_social_id_fkey" FOREIGN KEY (artist_social_id) REFERENCES socials(id) ON DELETE CASCADE not valid;

alter table "public"."social_fans" validate constraint "social_fans_artist_social_id_fkey";

alter table "public"."social_fans" add constraint "social_fans_fan_social_id_fkey" FOREIGN KEY (fan_social_id) REFERENCES socials(id) ON DELETE CASCADE not valid;

alter table "public"."social_fans" validate constraint "social_fans_fan_social_id_fkey";

alter table "public"."social_fans" add constraint "social_fans_latest_engagement_id_fkey" FOREIGN KEY (latest_engagement_id) REFERENCES post_comments(id) ON DELETE SET NULL not valid;

alter table "public"."social_fans" validate constraint "social_fans_latest_engagement_id_fkey";

-- Grant permissions
grant delete on table "public"."social_fans" to "anon";

grant insert on table "public"."social_fans" to "anon";

grant references on table "public"."social_fans" to "anon";

grant select on table "public"."social_fans" to "anon";

grant trigger on table "public"."social_fans" to "anon";

grant truncate on table "public"."social_fans" to "anon";

grant update on table "public"."social_fans" to "anon";

grant delete on table "public"."social_fans" to "authenticated";

grant insert on table "public"."social_fans" to "authenticated";

grant references on table "public"."social_fans" to "authenticated";

grant select on table "public"."social_fans" to "authenticated";

grant trigger on table "public"."social_fans" to "authenticated";

grant truncate on table "public"."social_fans" to "authenticated";

grant update on table "public"."social_fans" to "authenticated";

grant delete on table "public"."social_fans" to "service_role";

grant insert on table "public"."social_fans" to "service_role";

grant references on table "public"."social_fans" to "service_role";

grant select on table "public"."social_fans" to "service_role";

grant trigger on table "public"."social_fans" to "service_role";

grant truncate on table "public"."social_fans" to "service_role";

grant update on table "public"."social_fans" to "service_role";

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON social_fans
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();