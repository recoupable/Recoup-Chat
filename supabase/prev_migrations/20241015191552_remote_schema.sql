create schema if not exists "kit";

create extension if not exists "unaccent" with schema "kit" version '1.1';

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION kit.add_current_user_to_new_account()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
    if new.primary_owner_user_id = auth.uid() then
        insert into public.accounts_memberships(
            account_id,
            user_id,
            account_role)
        values(
            new.id,
            auth.uid(),
            public.get_upper_system_role());

    end if;

    return NEW;

end;

$function$
;

CREATE OR REPLACE FUNCTION kit.check_team_account()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
    if(
        select
            is_personal_account
        from
            public.accounts
        where
            id = new.account_id) then
        raise exception 'Account must be an team account';

    end if;

    return NEW;

end;

$function$
;

CREATE OR REPLACE FUNCTION kit.get_storage_filename_as_uuid(name text)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
    return replace(storage.filename(name), concat('.',
	storage.extension(name)), '')::uuid;

end;

$function$
;

CREATE OR REPLACE FUNCTION kit.handle_new_account_credits_usage()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  accounts_count integer;
begin
  -- collect the number of accounts the user has
  select count (*) from public.accounts
  where public.accounts.primary_owner_user_id = new.primary_owner_user_id
  and public.accounts.is_personal_account = false
  into accounts_count;

  -- we add credits only when this is the 1st account
  -- to avoid abuse of the free credits
  if accounts_count > 1 then
    insert into public.credits_usage (account_id, remaining_credits)
      values (new.id, 0);

    return new;
  end if;

  -- since this is the first account, we add 20000 credits
  insert into public.credits_usage (account_id, remaining_credits)
  values (new.id, 20000);
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION kit.handle_update_user_email()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
    update
        public.accounts
    set
        email = new.email
    where
        primary_owner_user_id = new.id
        and is_personal_account = true;

    return new;

end;

$function$
;

CREATE OR REPLACE FUNCTION kit.prevent_account_owner_membership_delete()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
    if exists(
        select
            1
        from
            public.accounts
        where
            id = old.account_id
            and primary_owner_user_id = old.user_id) then
    raise exception 'The primary account owner cannot be removed from the account membership list';

end if;

    return old;

end;

$function$
;

CREATE OR REPLACE FUNCTION kit.prevent_chats_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
-- only allow updating name and settings
if
  new.name <> old.name or
  new.settings <> old.settings
then
  return new;
end if;

end; $function$
;

CREATE OR REPLACE FUNCTION kit.prevent_memberships_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
    if new.account_role <> old.account_role then
        return new;
    end if;

    raise exception 'Only the account_role can be updated';

end; $function$
;

CREATE OR REPLACE FUNCTION kit.protect_account_fields()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
    if current_user in('authenticated', 'anon') then
	if new.id <> old.id or new.is_personal_account <>
	    old.is_personal_account or new.primary_owner_user_id <>
	    old.primary_owner_user_id or new.email <> old.email then
            raise exception 'You do not have permission to update this field';

        end if;

    end if;

    return NEW;

end
$function$
;

CREATE OR REPLACE FUNCTION kit.set_slug_from_account_name()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
    sql_string varchar;
    tmp_slug varchar;
    increment integer;
    tmp_row record;
    tmp_row_count integer;
begin
    tmp_row_count = 1;

    increment = 0;

    while tmp_row_count > 0 loop
        if increment > 0 then
            tmp_slug = kit.slugify(new.name || ' ' || increment::varchar);

        else
            tmp_slug = kit.slugify(new.name);

        end if;

	sql_string = format('select count(1) cnt from public.accounts where slug = ''' || tmp_slug ||
	    '''; ');

        for tmp_row in execute (sql_string)
            loop
                raise notice 'tmp_row %', tmp_row;

                tmp_row_count = tmp_row.cnt;

            end loop;

        increment = increment +1;

    end loop;

    new.slug := tmp_slug;

    return NEW;

end
$function$
;

CREATE OR REPLACE FUNCTION kit.setup_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
    user_name text;
begin
    if new.raw_user_meta_data ->> 'display_name' is not null then
        user_name := new.raw_user_meta_data ->> 'display_name';

    end if;

    if user_name is null and new.email is not null then
        user_name := split_part(new.email, '@', 1);

    end if;

    if user_name is null then
        user_name := '';

    end if;

    insert into public.accounts(
        id,
        primary_owner_user_id,
        name,
        is_personal_account,
        email)
    values (
        new.id,
        new.id,
        user_name,
        true,
        new.email);

    return new;

end;

$function$
;

CREATE OR REPLACE FUNCTION kit.slugify(value text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE STRICT
 SET search_path TO ''
AS $function$
    -- removes accents (diacritic signs) from a given string --
    with "unaccented" as(
        select
            kit.unaccent("value") as "value"
),
-- lowercases the string
"lowercase" as(
    select
        lower("value") as "value"
    from
        "unaccented"
),
-- remove single and double quotes
"removed_quotes" as(
    select
	regexp_replace("value", '[''"]+', '',
	    'gi') as "value"
    from
        "lowercase"
),
-- replaces anything that's not a letter, number, hyphen('-'), or underscore('_') with a hyphen('-')
"hyphenated" as(
    select
	regexp_replace("value", '[^a-z0-9\\-_]+', '-',
	    'gi') as "value"
    from
        "removed_quotes"
),
-- trims hyphens('-') if they exist on the head or tail of
--   the string
"trimmed" as(
    select
	regexp_replace(regexp_replace("value", '\-+$',
	    ''), '^\-', '') as "value" from "hyphenated"
)
        select
            "value"
        from
            "trimmed";
$function$
;

CREATE OR REPLACE FUNCTION kit.update_notification_dismissed_status()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
    old.dismissed := new.dismissed;

    if (new is distinct from old) then
         raise exception 'UPDATE of columns other than "dismissed" is forbidden';
    end if;

    return old;
end;
$function$
;


create type "public"."app_permissions" as enum ('roles.manage', 'billing.manage', 'settings.manage', 'members.manage', 'invites.manage', 'tasks.write', 'tasks.delete');

create type "public"."billing_provider" as enum ('stripe', 'lemon-squeezy', 'paddle');

create type "public"."chat_role" as enum ('user', 'assistant');

create type "public"."notification_channel" as enum ('in_app', 'email');

create type "public"."notification_type" as enum ('info', 'warning', 'error');

create type "public"."payment_status" as enum ('pending', 'succeeded', 'failed');

create type "public"."subscription_item_type" as enum ('flat', 'per_seat', 'metered');

create type "public"."subscription_status" as enum ('active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete', 'incomplete_expired', 'paused');

create sequence "public"."billing_customers_id_seq";

create sequence "public"."chat_messages_chat_id_seq";

create sequence "public"."chats_id_seq";

create sequence "public"."credits_usage_id_seq";

create sequence "public"."invitations_id_seq";

create table "public"."accounts" (
    "id" uuid not null default uuid_generate_v4(),
    "primary_owner_user_id" uuid not null default auth.uid(),
    "name" character varying(255) not null,
    "slug" text,
    "email" character varying(320),
    "is_personal_account" boolean not null default false,
    "updated_at" timestamp with time zone,
    "created_at" timestamp with time zone,
    "created_by" uuid,
    "updated_by" uuid,
    "picture_url" character varying(1000),
    "public_data" jsonb not null default '{}'::jsonb
);


alter table "public"."accounts" enable row level security;

create table "public"."accounts_memberships" (
    "user_id" uuid not null,
    "account_id" uuid not null,
    "account_role" character varying(50) not null,
    "created_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "created_by" uuid,
    "updated_by" uuid
);


alter table "public"."accounts_memberships" enable row level security;

create table "public"."app_store_link_clicked" (
    "clientId" text,
    "id" text,
    "timestamp" bigint
);


create table "public"."apple_login_button_clicked" (
    "clientId" text,
    "fanId" text,
    "timestamp" bigint,
    "game" text,
    "id" text
);


create table "public"."apple_music" (
    "game" text,
    "fanId" text,
    "syncid" text,
    "timestamp" bigint,
    "id" text,
    "syncId" text
);


create table "public"."apple_play_button_clicked" (
    "clientId" text,
    "fanId" text,
    "timestamp" bigint,
    "game" text,
    "id" text
);


create table "public"."artists" (
    "artist_id" uuid not null default gen_random_uuid(),
    "name" character varying(255) not null,
    "account_id" uuid,
    "label_id" text,
    "created_at" timestamp with time zone default now()
);


create table "public"."billing_customers" (
    "account_id" uuid not null,
    "id" integer not null default nextval('billing_customers_id_seq'::regclass),
    "email" text,
    "provider" billing_provider not null,
    "customer_id" text not null
);


alter table "public"."billing_customers" enable row level security;

create table "public"."campaigns" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now()
);


create table "public"."chat_messages" (
    "id" uuid not null default gen_random_uuid(),
    "chat_id" integer not null default nextval('chat_messages_chat_id_seq'::regclass),
    "account_id" uuid not null,
    "content" text not null,
    "role" chat_role not null,
    "created_at" timestamp with time zone default now()
);


alter table "public"."chat_messages" enable row level security;

create table "public"."chats" (
    "id" integer not null default nextval('chats_id_seq'::regclass),
    "reference_id" character varying(8) not null,
    "name" character varying(255) not null,
    "account_id" uuid not null,
    "settings" jsonb not null default '{}'::jsonb,
    "created_at" timestamp with time zone default now()
);


alter table "public"."chats" enable row level security;

create table "public"."config" (
    "enable_team_accounts" boolean not null default true,
    "enable_account_billing" boolean not null default true,
    "enable_team_account_billing" boolean not null default true,
    "billing_provider" billing_provider not null default 'stripe'::billing_provider
);


alter table "public"."config" enable row level security;

create table "public"."cookie_players" (
    "game" text,
    "uniquePlayerID" text,
    "timestamp" bigint,
    "id" text
);


create table "public"."credits_usage" (
    "id" integer not null default nextval('credits_usage_id_seq'::regclass),
    "account_id" uuid not null,
    "remaining_credits" integer not null default 0
);


alter table "public"."credits_usage" enable row level security;

create table "public"."cta_redirect" (
    "id" bigint generated by default as identity not null,
    "clientId" text not null,
    "timestamp" timestamp with time zone,
    "url" text
);


alter table "public"."cta_redirect" enable row level security;

create table "public"."fans" (
    "id" uuid not null default gen_random_uuid(),
    "country" character varying,
    "city" character varying,
    "time_zone" character varying,
    "images" jsonb,
    "product" character varying,
    "explicit_content_filter_locked" boolean,
    "explicit_content_filter_enabled" boolean,
    "display_name" character varying,
    "type" character varying,
    "uri" text,
    "followers_total" integer,
    "playlist" jsonb,
    "href" text,
    "external_urls_spotify" text,
    "email" character varying,
    "timestamp" text,
    "first_stream_date" timestamp with time zone,
    "last_stream_date" timestamp with time zone,
    "total_streams" integer,
    "recently_played" jsonb,
    "heavy_rotations" jsonb,
    "recommendations" jsonb,
    "saved_podcasts" jsonb,
    "saved_audiobooks" jsonb,
    "saved_shows" jsonb,
    "top_artists_long_term" jsonb,
    "top_artists_medium_term" jsonb,
    "top_tracks_long_term" jsonb,
    "top_tracks_medium_term" jsonb,
    "top_tracks_short_term" jsonb,
    "campaign_id" text,
    "twitter_handle" character varying,
    "instagram_handle" character varying,
    "reddit_username" character varying,
    "discord_username" character varying,
    "facebook_profile_url" text,
    "youtube_channel_url" text,
    "tiktok_handle" character varying,
    "linkedin_profile_url" text,
    "last_login" timestamp with time zone,
    "preferences" jsonb,
    "gamification_points" integer default 0,
    "engagement_level" character varying,
    "preferred_device" character varying,
    "os_type" character varying,
    "campaign_interaction_count" integer,
    "last_campaign_interaction" timestamp with time zone,
    "subscription_tier" character varying,
    "last_purchase_date" timestamp with time zone,
    "total_spent" numeric,
    "email_open_rate" numeric,
    "click_through_rate" numeric,
    "social_shares" integer,
    "recommended_events" jsonb,
    "preferred_artists" jsonb,
    "custom_tags" jsonb,
    "account_status" character varying,
    "consent_given" boolean,
    "explicit_content.filter_locked" boolean,
    "explicit_content.filter_enabled" boolean,
    "followers.total" integer,
    "external_urls.spotify" text,
    "recentlyPlayed" jsonb,
    "heavyRotations" jsonb,
    "clientId" text,
    "testField" text,
    "followers.href" text,
    "episodes" jsonb[],
    "apple_token" text,
    "spotify_token" text
);


alter table "public"."fans" enable row level security;

create table "public"."follows" (
    "timestamp" bigint,
    "game" text,
    "id" text
);


create table "public"."game_start" (
    "game" text,
    "timestamp" bigint,
    "clientId" text,
    "fanId" jsonb,
    "id" text
);


create table "public"."invitations" (
    "id" integer not null default nextval('invitations_id_seq'::regclass),
    "email" character varying(255) not null,
    "account_id" uuid not null,
    "invited_by" uuid not null,
    "role" character varying(50) not null,
    "invite_token" character varying(255) not null,
    "created_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "expires_at" timestamp with time zone not null default (CURRENT_TIMESTAMP + '7 days'::interval)
);


alter table "public"."invitations" enable row level security;

create table "public"."ios_redirect" (
    "clientId" text,
    "fanId" text,
    "timestamp" bigint,
    "id" text
);


create table "public"."leaderboard" (
    "Score" text,
    "Number" text,
    "Time._nanoseconds" text,
    "Spotify" text,
    "Name" text,
    "Time._seconds" text,
    "id" text
);


create table "public"."leaderboard_boogie" (
    "gameType" text,
    "score" integer,
    "clientId" text,
    "fanId" text,
    "displayName" text,
    "timestamp" text,
    "id" text
);


create table "public"."leaderboard_luh_tyler_3d" (
    "Score" text,
    "Time" text,
    "timestamp" text,
    "FanId" text,
    "UserName" text,
    "ScorePerTime" text,
    "id" text
);


create table "public"."leaderboard_luv" (
    "f" text,
    "id" text
);


create table "public"."notifications" (
    "id" bigint generated always as identity not null,
    "account_id" uuid not null,
    "type" notification_type not null default 'info'::notification_type,
    "body" character varying(5000) not null,
    "link" character varying(255),
    "channel" notification_channel not null default 'in_app'::notification_channel,
    "dismissed" boolean not null default false,
    "expires_at" timestamp with time zone default (now() + '1 mon'::interval),
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."notifications" enable row level security;

create table "public"."order_items" (
    "id" text not null,
    "order_id" text not null,
    "product_id" text not null,
    "variant_id" text not null,
    "price_amount" numeric,
    "quantity" integer not null default 1,
    "created_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone not null default CURRENT_TIMESTAMP
);


alter table "public"."order_items" enable row level security;

create table "public"."orders" (
    "id" text not null,
    "account_id" uuid not null,
    "billing_customer_id" integer not null,
    "status" payment_status not null,
    "billing_provider" billing_provider not null,
    "total_amount" numeric not null,
    "currency" character varying(3) not null,
    "created_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone not null default CURRENT_TIMESTAMP
);


alter table "public"."orders" enable row level security;

create table "public"."plans" (
    "variant_id" character varying(255) not null,
    "name" character varying(255) not null,
    "tokens_quota" integer not null
);


alter table "public"."plans" enable row level security;

create table "public"."popup_open" (
    "clientId" text,
    "fanId" text,
    "timestamp" text,
    "game" text,
    "id" text
);


create table "public"."presave" (
    "fanId" text,
    "presaveId" text,
    "timestamp" bigint,
    "id" text,
    "accessToken" text,
    "refreshToken" text,
    "presaveReleaseDate" text,
    "fanId.error.code" text,
    "fanId.error.name" text
);


create table "public"."role_permissions" (
    "id" bigint generated by default as identity not null,
    "role" character varying(50) not null,
    "permission" app_permissions not null
);


alter table "public"."role_permissions" enable row level security;

create table "public"."roles" (
    "name" character varying(50) not null,
    "hierarchy_level" integer not null
);


alter table "public"."roles" enable row level security;

create table "public"."save_track" (
    "timestamp" text,
    "game" text,
    "id" text
);


create table "public"."spotify" (
    "fanId" text,
    "syncId" text,
    "timestamp" text,
    "game" text,
    "country" text,
    "images" jsonb,
    "product" text,
    "explicit_content.filter_enabled" text,
    "display_name" text,
    "type" text,
    "uri" text,
    "followers.total" jsonb,
    "href" text,
    "id" text,
    "external_urls.spotify" jsonb,
    "email" text,
    "playlist" jsonb,
    "clientId" text,
    "explicit_content.filter_locked" text,
    "fanId.country" text,
    "fanId.display_name" text,
    "fanId.email" text,
    "fanId.explicit_content.filter_enabled" text,
    "fanId.explicit_content.filter_locked" text,
    "fanId.external_urls.spotify" text,
    "fanId.followers.total" text,
    "fanId.href" text,
    "fanId.id" text,
    "fanId.images" text,
    "fanId.isNewFan" text,
    "fanId.playlist" text,
    "fanId.presavedData.clientId" text,
    "fanId.presavedData.country" text,
    "fanId.presavedData.display_name" text,
    "fanId.presavedData.email" text,
    "fanId.presavedData.explicit_content.filter_enabled" text,
    "fanId.presavedData.explicit_content.filter_locked" text,
    "fanId.presavedData.external_urls.spotify" text,
    "fanId.presavedData.followers.total" text,
    "fanId.presavedData.href" text,
    "fanId.presavedData.id" text,
    "fanId.presavedData.images" text,
    "fanId.presavedData.playlist" text,
    "fanId.presavedData.product" text,
    "fanId.presavedData.recentlyPlayed" text,
    "fanId.presavedData.timestamp" text,
    "fanId.presavedData.type" text,
    "fanId.presavedData.uri" text,
    "fanId.product" text,
    "fanId.timestamp" text,
    "fanId.type" text,
    "fanId.uri" text
);


create table "public"."spotify_login_button_clicked" (
    "clientId" text,
    "fanId" text,
    "timestamp" bigint,
    "game" text,
    "id" text
);


create table "public"."spotify_play_button_clicked" (
    "clientId" text,
    "fanId" text,
    "timestamp" bigint,
    "game" text,
    "id" text
);


create table "public"."subscription_items" (
    "id" character varying(255) not null,
    "subscription_id" text not null,
    "product_id" character varying(255) not null,
    "variant_id" character varying(255) not null,
    "type" subscription_item_type not null,
    "price_amount" numeric,
    "quantity" integer not null default 1,
    "interval" character varying(255) not null,
    "interval_count" integer not null,
    "created_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone not null default CURRENT_TIMESTAMP
);


alter table "public"."subscription_items" enable row level security;

create table "public"."subscriptions" (
    "id" text not null,
    "account_id" uuid not null,
    "billing_customer_id" integer not null,
    "status" subscription_status not null,
    "active" boolean not null,
    "billing_provider" billing_provider not null,
    "cancel_at_period_end" boolean not null,
    "currency" character varying(3) not null,
    "created_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "period_starts_at" timestamp with time zone not null,
    "period_ends_at" timestamp with time zone not null,
    "trial_starts_at" timestamp with time zone,
    "trial_ends_at" timestamp with time zone
);


alter table "public"."subscriptions" enable row level security;

create table "public"."tasks" (
    "id" uuid not null default gen_random_uuid(),
    "title" character varying(500) not null,
    "description" character varying(50000),
    "done" boolean not null default false,
    "account_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."tasks" enable row level security;

alter sequence "public"."billing_customers_id_seq" owned by "public"."billing_customers"."id";

alter sequence "public"."chat_messages_chat_id_seq" owned by "public"."chat_messages"."chat_id";

alter sequence "public"."chats_id_seq" owned by "public"."chats"."id";

alter sequence "public"."credits_usage_id_seq" owned by "public"."credits_usage"."id";

alter sequence "public"."invitations_id_seq" owned by "public"."invitations"."id";

CREATE UNIQUE INDEX accounts_email_key ON public.accounts USING btree (email);

CREATE UNIQUE INDEX accounts_memberships_pkey ON public.accounts_memberships USING btree (user_id, account_id);

CREATE UNIQUE INDEX accounts_pkey ON public.accounts USING btree (id);

CREATE UNIQUE INDEX accounts_slug_key ON public.accounts USING btree (slug);

CREATE UNIQUE INDEX artists_pkey ON public.artists USING btree (artist_id);

CREATE UNIQUE INDEX billing_customers_account_id_customer_id_provider_key ON public.billing_customers USING btree (account_id, customer_id, provider);

CREATE UNIQUE INDEX billing_customers_pkey ON public.billing_customers USING btree (id);

CREATE UNIQUE INDEX campaigns_pkey ON public.campaigns USING btree (id);

CREATE UNIQUE INDEX chat_messages_pkey ON public.chat_messages USING btree (id);

CREATE UNIQUE INDEX chats_pkey ON public.chats USING btree (id);

CREATE UNIQUE INDEX chats_reference_id_key ON public.chats USING btree (reference_id);

CREATE UNIQUE INDEX credits_usage_pkey ON public.credits_usage USING btree (id);

CREATE UNIQUE INDEX cta_redirect_pkey ON public.cta_redirect USING btree (id);

CREATE UNIQUE INDEX fans_pkey ON public.fans USING btree (id);

CREATE INDEX idx_fans_campaign_id ON public.fans USING btree (campaign_id);

CREATE INDEX idx_fans_country ON public.fans USING btree (country);

CREATE INDEX idx_fans_custom_tags ON public.fans USING gin (custom_tags);

CREATE INDEX idx_fans_email ON public.fans USING btree (email);

CREATE INDEX idx_fans_heavy_rotations ON public.fans USING gin (heavy_rotations);

CREATE INDEX idx_fans_last_login ON public.fans USING btree (last_login);

CREATE INDEX idx_fans_preferences ON public.fans USING gin (preferences);

CREATE INDEX idx_fans_preferred_artists ON public.fans USING gin (preferred_artists);

CREATE INDEX idx_fans_product ON public.fans USING btree (product);

CREATE INDEX idx_fans_recently_played ON public.fans USING gin (recently_played);

CREATE INDEX idx_fans_recommendations ON public.fans USING gin (recommendations);

CREATE INDEX idx_fans_recommended_events ON public.fans USING gin (recommended_events);

CREATE INDEX idx_fans_saved_audiobooks ON public.fans USING gin (saved_audiobooks);

CREATE INDEX idx_fans_saved_podcasts ON public.fans USING gin (saved_podcasts);

CREATE INDEX idx_fans_saved_shows ON public.fans USING gin (saved_shows);

CREATE INDEX idx_fans_timestamp ON public.fans USING btree ("timestamp");

CREATE INDEX idx_fans_top_artists_long_term ON public.fans USING gin (top_artists_long_term);

CREATE INDEX idx_fans_top_artists_medium_term ON public.fans USING gin (top_artists_medium_term);

CREATE INDEX idx_fans_top_tracks_long_term ON public.fans USING gin (top_tracks_long_term);

CREATE INDEX idx_fans_top_tracks_medium_term ON public.fans USING gin (top_tracks_medium_term);

CREATE INDEX idx_fans_top_tracks_short_term ON public.fans USING gin (top_tracks_short_term);

CREATE INDEX idx_notifications_account_dismissed ON public.notifications USING btree (account_id, dismissed, expires_at);

CREATE UNIQUE INDEX invitations_email_account_id_key ON public.invitations USING btree (email, account_id);

CREATE UNIQUE INDEX invitations_invite_token_key ON public.invitations USING btree (invite_token);

CREATE UNIQUE INDEX invitations_pkey ON public.invitations USING btree (id);

CREATE INDEX ix_accounts_is_personal_account ON public.accounts USING btree (is_personal_account);

CREATE INDEX ix_accounts_memberships_account_id ON public.accounts_memberships USING btree (account_id);

CREATE INDEX ix_accounts_memberships_account_role ON public.accounts_memberships USING btree (account_role);

CREATE INDEX ix_accounts_memberships_user_id ON public.accounts_memberships USING btree (user_id);

CREATE INDEX ix_accounts_primary_owner_user_id ON public.accounts USING btree (primary_owner_user_id);

CREATE INDEX ix_billing_customers_account_id ON public.billing_customers USING btree (account_id);

CREATE INDEX ix_chat_messages_chat_id ON public.chat_messages USING btree (chat_id);

CREATE INDEX ix_chats_account_id ON public.chats USING btree (account_id);

CREATE INDEX ix_invitations_account_id ON public.invitations USING btree (account_id);

CREATE INDEX ix_order_items_order_id ON public.order_items USING btree (order_id);

CREATE INDEX ix_orders_account_id ON public.orders USING btree (account_id);

CREATE INDEX ix_role_permissions_role ON public.role_permissions USING btree (role);

CREATE INDEX ix_subscription_items_subscription_id ON public.subscription_items USING btree (subscription_id);

CREATE INDEX ix_subscriptions_account_id ON public.subscriptions USING btree (account_id);

CREATE INDEX ix_tasks_account_id ON public.tasks USING btree (account_id);

CREATE UNIQUE INDEX notifications_pkey ON public.notifications USING btree (id);

CREATE UNIQUE INDEX order_items_order_id_product_id_variant_id_key ON public.order_items USING btree (order_id, product_id, variant_id);

CREATE UNIQUE INDEX order_items_pkey ON public.order_items USING btree (id);

CREATE UNIQUE INDEX orders_pkey ON public.orders USING btree (id);

CREATE UNIQUE INDEX plans_pkey ON public.plans USING btree (variant_id);

CREATE UNIQUE INDEX role_permissions_pkey ON public.role_permissions USING btree (id);

CREATE UNIQUE INDEX role_permissions_role_permission_key ON public.role_permissions USING btree (role, permission);

CREATE UNIQUE INDEX roles_hierarchy_level_key ON public.roles USING btree (hierarchy_level);

CREATE UNIQUE INDEX roles_pkey ON public.roles USING btree (name);

CREATE UNIQUE INDEX subscription_items_pkey ON public.subscription_items USING btree (id);

CREATE UNIQUE INDEX subscription_items_subscription_id_product_id_variant_id_key ON public.subscription_items USING btree (subscription_id, product_id, variant_id);

CREATE UNIQUE INDEX subscriptions_pkey ON public.subscriptions USING btree (id);

CREATE UNIQUE INDEX tasks_pkey ON public.tasks USING btree (id);

CREATE UNIQUE INDEX unique_personal_account ON public.accounts USING btree (primary_owner_user_id) WHERE (is_personal_account = true);

alter table "public"."accounts" add constraint "accounts_pkey" PRIMARY KEY using index "accounts_pkey";

alter table "public"."accounts_memberships" add constraint "accounts_memberships_pkey" PRIMARY KEY using index "accounts_memberships_pkey";

alter table "public"."artists" add constraint "artists_pkey" PRIMARY KEY using index "artists_pkey";

alter table "public"."billing_customers" add constraint "billing_customers_pkey" PRIMARY KEY using index "billing_customers_pkey";

alter table "public"."campaigns" add constraint "campaigns_pkey" PRIMARY KEY using index "campaigns_pkey";

alter table "public"."chat_messages" add constraint "chat_messages_pkey" PRIMARY KEY using index "chat_messages_pkey";

alter table "public"."chats" add constraint "chats_pkey" PRIMARY KEY using index "chats_pkey";

alter table "public"."credits_usage" add constraint "credits_usage_pkey" PRIMARY KEY using index "credits_usage_pkey";

alter table "public"."cta_redirect" add constraint "cta_redirect_pkey" PRIMARY KEY using index "cta_redirect_pkey";

alter table "public"."fans" add constraint "fans_pkey" PRIMARY KEY using index "fans_pkey";

alter table "public"."invitations" add constraint "invitations_pkey" PRIMARY KEY using index "invitations_pkey";

alter table "public"."notifications" add constraint "notifications_pkey" PRIMARY KEY using index "notifications_pkey";

alter table "public"."order_items" add constraint "order_items_pkey" PRIMARY KEY using index "order_items_pkey";

alter table "public"."orders" add constraint "orders_pkey" PRIMARY KEY using index "orders_pkey";

alter table "public"."plans" add constraint "plans_pkey" PRIMARY KEY using index "plans_pkey";

alter table "public"."role_permissions" add constraint "role_permissions_pkey" PRIMARY KEY using index "role_permissions_pkey";

alter table "public"."roles" add constraint "roles_pkey" PRIMARY KEY using index "roles_pkey";

alter table "public"."subscription_items" add constraint "subscription_items_pkey" PRIMARY KEY using index "subscription_items_pkey";

alter table "public"."subscriptions" add constraint "subscriptions_pkey" PRIMARY KEY using index "subscriptions_pkey";

alter table "public"."tasks" add constraint "tasks_pkey" PRIMARY KEY using index "tasks_pkey";

alter table "public"."accounts" add constraint "accounts_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."accounts" validate constraint "accounts_created_by_fkey";

alter table "public"."accounts" add constraint "accounts_email_key" UNIQUE using index "accounts_email_key";

alter table "public"."accounts" add constraint "accounts_primary_owner_user_id_fkey" FOREIGN KEY (primary_owner_user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."accounts" validate constraint "accounts_primary_owner_user_id_fkey";

alter table "public"."accounts" add constraint "accounts_slug_key" UNIQUE using index "accounts_slug_key";

alter table "public"."accounts" add constraint "accounts_slug_null_if_personal_account_true" CHECK ((((is_personal_account = true) AND (slug IS NULL)) OR ((is_personal_account = false) AND (slug IS NOT NULL)))) not valid;

alter table "public"."accounts" validate constraint "accounts_slug_null_if_personal_account_true";

alter table "public"."accounts" add constraint "accounts_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth.users(id) not valid;

alter table "public"."accounts" validate constraint "accounts_updated_by_fkey";

alter table "public"."accounts_memberships" add constraint "accounts_memberships_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE not valid;

alter table "public"."accounts_memberships" validate constraint "accounts_memberships_account_id_fkey";

alter table "public"."accounts_memberships" add constraint "accounts_memberships_account_role_fkey" FOREIGN KEY (account_role) REFERENCES roles(name) not valid;

alter table "public"."accounts_memberships" validate constraint "accounts_memberships_account_role_fkey";

alter table "public"."accounts_memberships" add constraint "accounts_memberships_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."accounts_memberships" validate constraint "accounts_memberships_created_by_fkey";

alter table "public"."accounts_memberships" add constraint "accounts_memberships_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth.users(id) not valid;

alter table "public"."accounts_memberships" validate constraint "accounts_memberships_updated_by_fkey";

alter table "public"."accounts_memberships" add constraint "accounts_memberships_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."accounts_memberships" validate constraint "accounts_memberships_user_id_fkey";

alter table "public"."artists" add constraint "artists_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(id) not valid;

alter table "public"."artists" validate constraint "artists_account_id_fkey";

alter table "public"."billing_customers" add constraint "billing_customers_account_id_customer_id_provider_key" UNIQUE using index "billing_customers_account_id_customer_id_provider_key";

alter table "public"."billing_customers" add constraint "billing_customers_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE not valid;

alter table "public"."billing_customers" validate constraint "billing_customers_account_id_fkey";

alter table "public"."chat_messages" add constraint "chat_messages_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE not valid;

alter table "public"."chat_messages" validate constraint "chat_messages_account_id_fkey";

alter table "public"."chat_messages" add constraint "chat_messages_chat_id_fkey" FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE not valid;

alter table "public"."chat_messages" validate constraint "chat_messages_chat_id_fkey";

alter table "public"."chats" add constraint "chats_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE not valid;

alter table "public"."chats" validate constraint "chats_account_id_fkey";

alter table "public"."chats" add constraint "chats_reference_id_key" UNIQUE using index "chats_reference_id_key";

alter table "public"."credits_usage" add constraint "credits_usage_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE not valid;

alter table "public"."credits_usage" validate constraint "credits_usage_account_id_fkey";

alter table "public"."invitations" add constraint "invitations_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE not valid;

alter table "public"."invitations" validate constraint "invitations_account_id_fkey";

alter table "public"."invitations" add constraint "invitations_email_account_id_key" UNIQUE using index "invitations_email_account_id_key";

alter table "public"."invitations" add constraint "invitations_invite_token_key" UNIQUE using index "invitations_invite_token_key";

alter table "public"."invitations" add constraint "invitations_invited_by_fkey" FOREIGN KEY (invited_by) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."invitations" validate constraint "invitations_invited_by_fkey";

alter table "public"."invitations" add constraint "invitations_role_fkey" FOREIGN KEY (role) REFERENCES roles(name) not valid;

alter table "public"."invitations" validate constraint "invitations_role_fkey";

alter table "public"."notifications" add constraint "notifications_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_account_id_fkey";

alter table "public"."order_items" add constraint "order_items_order_id_fkey" FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE not valid;

alter table "public"."order_items" validate constraint "order_items_order_id_fkey";

alter table "public"."order_items" add constraint "order_items_order_id_product_id_variant_id_key" UNIQUE using index "order_items_order_id_product_id_variant_id_key";

alter table "public"."orders" add constraint "orders_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE not valid;

alter table "public"."orders" validate constraint "orders_account_id_fkey";

alter table "public"."orders" add constraint "orders_billing_customer_id_fkey" FOREIGN KEY (billing_customer_id) REFERENCES billing_customers(id) ON DELETE CASCADE not valid;

alter table "public"."orders" validate constraint "orders_billing_customer_id_fkey";

alter table "public"."role_permissions" add constraint "role_permissions_role_fkey" FOREIGN KEY (role) REFERENCES roles(name) not valid;

alter table "public"."role_permissions" validate constraint "role_permissions_role_fkey";

alter table "public"."role_permissions" add constraint "role_permissions_role_permission_key" UNIQUE using index "role_permissions_role_permission_key";

alter table "public"."roles" add constraint "roles_hierarchy_level_check" CHECK ((hierarchy_level > 0)) not valid;

alter table "public"."roles" validate constraint "roles_hierarchy_level_check";

alter table "public"."roles" add constraint "roles_hierarchy_level_key" UNIQUE using index "roles_hierarchy_level_key";

alter table "public"."subscription_items" add constraint "subscription_items_interval_count_check" CHECK ((interval_count > 0)) not valid;

alter table "public"."subscription_items" validate constraint "subscription_items_interval_count_check";

alter table "public"."subscription_items" add constraint "subscription_items_subscription_id_fkey" FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE not valid;

alter table "public"."subscription_items" validate constraint "subscription_items_subscription_id_fkey";

alter table "public"."subscription_items" add constraint "subscription_items_subscription_id_product_id_variant_id_key" UNIQUE using index "subscription_items_subscription_id_product_id_variant_id_key";

alter table "public"."subscriptions" add constraint "subscriptions_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_account_id_fkey";

alter table "public"."subscriptions" add constraint "subscriptions_billing_customer_id_fkey" FOREIGN KEY (billing_customer_id) REFERENCES billing_customers(id) ON DELETE CASCADE not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_billing_customer_id_fkey";

alter table "public"."tasks" add constraint "tasks_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(id) not valid;

alter table "public"."tasks" validate constraint "tasks_account_id_fkey";

set check_function_bodies = off;

create type "public"."invitation" as ("email" text, "role" character varying(50));

CREATE OR REPLACE FUNCTION public.accept_invitation(token text, user_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
    target_account_id uuid;
    target_role varchar(50);
begin
    select
        account_id,
        role into target_account_id,
        target_role
    from
        public.invitations
    where
        invite_token = token
        and expires_at > now();

    if not found then
        raise exception 'Invalid or expired invitation token';
    end if;

    insert into public.accounts_memberships(
        user_id,
        account_id,
        account_role)
    values (
        accept_invitation.user_id,
        target_account_id,
        target_role);

    delete from public.invitations
    where invite_token = token;

    return target_account_id;
end;

$function$
;

CREATE OR REPLACE FUNCTION "public"."add_invitations_to_account"("account_slug" "text", "invitations" "public"."invitation"[]) RETURNS "public"."invitations"[]
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
declare
    new_invitation public.invitations;
    all_invitations public.invitations[] := array[]::public.invitations[];
    invite_token text;
    email text;
    role varchar(50);
begin
    FOREACH email,
    role in array invitations loop
        invite_token := extensions.uuid_generate_v4();

        insert into public.invitations(
            email,
            account_id,
            invited_by,
            role,
            invite_token)
        values (
            email,
(
                select
                    id
                from
                    public.accounts
                where
                    slug = account_slug), auth.uid(), role, invite_token)
    returning
        * into new_invitation;

        all_invitations := array_append(all_invitations, new_invitation);

    end loop;

    return all_invitations;

end;

$$;

CREATE OR REPLACE FUNCTION public.can_action_account_member(target_team_account_id uuid, target_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
    permission_granted boolean;
    target_user_hierarchy_level int;
    current_user_hierarchy_level int;
    is_account_owner boolean;
    target_user_role varchar(50);
begin
    if target_user_id = auth.uid() then
      raise exception 'You cannot update your own account membership with this function';
    end if;

    -- an account owner can action any member of the account
    if public.is_account_owner(target_team_account_id) then
      return true;
    end if;

     -- check the target user is the primary owner of the account
    select
        exists (
            select
                1
            from
                public.accounts
            where
                id = target_team_account_id
                and primary_owner_user_id = target_user_id) into is_account_owner;

    if is_account_owner then
        raise exception 'The primary account owner cannot be actioned';
    end if;

    -- validate the auth user has the required permission on the account
    -- to manage members of the account
    select
 public.has_permission(auth.uid(), target_team_account_id,
     'members.manage'::public.app_permissions) into
     permission_granted;

    -- if the user does not have the required permission, raise an exception
    if not permission_granted then
      raise exception 'You do not have permission to action a member from this account';
    end if;

    -- get the role of the target user
    select
        am.account_role,
        r.hierarchy_level
    from
        public.accounts_memberships as am
    join
        public.roles as r on am.account_role = r.name
    where
        am.account_id = target_team_account_id
        and am.user_id = target_user_id
    into target_user_role, target_user_hierarchy_level;

    -- get the hierarchy level of the current user
    select
        r.hierarchy_level into current_user_hierarchy_level
    from
        public.roles as r
    join
        public.accounts_memberships as am on r.name = am.account_role
    where
        am.account_id = target_team_account_id
        and am.user_id = auth.uid();

    if target_user_role is null then
      raise exception 'The target user does not have a role on the account';
    end if;

    if current_user_hierarchy_level is null then
      raise exception 'The current user does not have a role on the account';
    end if;

    -- check the current user has a higher role than the target user
    if current_user_hierarchy_level >= target_user_hierarchy_level then
      raise exception 'You do not have permission to action a member from this account';
    end if;

    return true;

end;

$function$
;

CREATE OR REPLACE FUNCTION public.create_invitation(account_id uuid, email text, role character varying)
 RETURNS invitations
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
    new_invitation public.invitations;
    invite_token text;
begin
    invite_token := extensions.uuid_generate_v4();

    insert into public.invitations(
        email,
        account_id,
        invited_by,
        role,
        invite_token)
    values (
        email,
        account_id,
        auth.uid(),
        role,
        invite_token)
returning
    * into new_invitation;

    return new_invitation;

end;

$function$
;

CREATE OR REPLACE FUNCTION public.create_team_account(account_name text)
 RETURNS accounts
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
    new_account public.accounts;
begin
    if (not public.is_set('enable_team_accounts')) then
        raise exception 'Team accounts are not enabled';
    end if;

    insert into public.accounts(
        name,
        is_personal_account)
    values (
        account_name,
        false)
returning
    * into new_account;

    return new_account;

end;

$function$
;

CREATE OR REPLACE FUNCTION public.deduct_credits(account_id uuid, amount integer)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  update public.credits_usage
  set remaining_credits = remaining_credits - amount
  where public.credits_usage.account_id = $1;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_account_invitations(account_slug text)
 RETURNS TABLE(id integer, email character varying, account_id uuid, invited_by uuid, role character varying, created_at timestamp with time zone, updated_at timestamp with time zone, expires_at timestamp with time zone, inviter_name character varying, inviter_email character varying)
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
    return query
    select
        invitation.id,
        invitation.email,
        invitation.account_id,
        invitation.invited_by,
        invitation.role,
        invitation.created_at,
        invitation.updated_at,
        invitation.expires_at,
        account.name,
        account.email
    from
        public.invitations as invitation
        join public.accounts as account on invitation.account_id = account.id
    where
        account.slug = account_slug;

end;

$function$
;

CREATE OR REPLACE FUNCTION public.get_account_members(account_slug text)
 RETURNS TABLE(id uuid, user_id uuid, account_id uuid, role character varying, role_hierarchy_level integer, primary_owner_user_id uuid, name character varying, email character varying, picture_url character varying, created_at timestamp with time zone, updated_at timestamp with time zone)
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
    return QUERY
    select
        acc.id,
        am.user_id,
        am.account_id,
        am.account_role,
        r.hierarchy_level,
        a.primary_owner_user_id,
        acc.name,
        acc.email,
        acc.picture_url,
        am.created_at,
        am.updated_at
    from
        public.accounts_memberships am
        join public.accounts a on a.id = am.account_id
        join public.accounts acc on acc.id = am.user_id
        join public.roles r on r.name = am.account_role
    where
        a.slug = account_slug;

end;

$function$
;

CREATE OR REPLACE FUNCTION public.get_config()
 RETURNS json
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
    result record;
begin
    select
        *
    from
        public.config
    limit 1 into result;

    return row_to_json(result);

end;

$function$
;

CREATE OR REPLACE FUNCTION public.get_upper_system_role()
 RETURNS character varying
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
    role varchar(50);
begin
    select name from public.roles
      where hierarchy_level = 1 into role;

    return role;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.has_active_subscription(target_account_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
    return exists (
        select
            1
        from
            public.subscriptions
        where
            account_id = target_account_id
            and active = true);

end;

$function$
;

CREATE OR REPLACE FUNCTION public.has_credits(account_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE
AS $function$
    select remaining_credits > 0 from public.credits_usage where public.credits_usage.account_id = $1;
 $function$
;

CREATE OR REPLACE FUNCTION public.has_more_elevated_role(target_user_id uuid, target_account_id uuid, role_name character varying)
 RETURNS boolean
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
    declare is_primary_owner boolean;
    user_role_hierarchy_level int;
    target_role_hierarchy_level int;
begin
    -- Check if the user is the primary owner of the account
    select
        exists (
            select
                1
            from
                public.accounts
            where
                id = target_account_id
                and primary_owner_user_id = target_user_id) into is_primary_owner;

    -- If the user is the primary owner, they have the highest role and can
    --   perform any action
    if is_primary_owner then
        return true;
    end if;

    -- Get the hierarchy level of the user's role within the account
    select
        hierarchy_level into user_role_hierarchy_level
    from
        public.roles
    where
        name =(
            select
                account_role
            from
                public.accounts_memberships
            where
                account_id = target_account_id
                and target_user_id = user_id);

    if user_role_hierarchy_level is null then
        return false;
    end if;

    -- Get the hierarchy level of the target role
    select
        hierarchy_level into target_role_hierarchy_level
    from
        public.roles
    where
        name = role_name;

    -- If the target role does not exist, the user cannot perform the action
    if target_role_hierarchy_level is null then
        return false;
    end if;

    -- If the user's role is higher than the target role, they can perform
    --   the action
    return user_role_hierarchy_level < target_role_hierarchy_level;

end;

$function$
;

CREATE OR REPLACE FUNCTION public.has_permission(user_id uuid, account_id uuid, permission_name app_permissions)
 RETURNS boolean
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
    return exists(
        select
            1
        from
            public.accounts_memberships
	    join public.role_permissions on
		accounts_memberships.account_role =
		role_permissions.role
        where
            accounts_memberships.user_id = has_permission.user_id
            and accounts_memberships.account_id = has_permission.account_id
            and role_permissions.permission = has_permission.permission_name);

end;

$function$
;

CREATE OR REPLACE FUNCTION public.has_role_on_account(account_id uuid, account_role character varying DEFAULT NULL::character varying)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
    select
        exists(
            select
                1
            from
                public.accounts_memberships membership
            where
                membership.user_id = (select auth.uid())
                and membership.account_id = has_role_on_account.account_id
                and((membership.account_role = has_role_on_account.account_role
                    or has_role_on_account.account_role is null)));
$function$
;

CREATE OR REPLACE FUNCTION public.has_same_role_hierarchy_level(target_user_id uuid, target_account_id uuid, role_name character varying)
 RETURNS boolean
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
    is_primary_owner boolean;
    user_role_hierarchy_level int;
    target_role_hierarchy_level int;
begin
    -- Check if the user is the primary owner of the account
    select
        exists (
            select
                1
            from
                public.accounts
            where
                id = target_account_id
                and primary_owner_user_id = target_user_id) into is_primary_owner;

    -- If the user is the primary owner, they have the highest role and can perform any action
    if is_primary_owner then
        return true;
    end if;

    -- Get the hierarchy level of the user's role within the account
    select
        hierarchy_level into user_role_hierarchy_level
    from
        public.roles
    where
        name =(
            select
                account_role
            from
                public.accounts_memberships
            where
                account_id = target_account_id
                and target_user_id = user_id);

    -- If the user does not have a role in the account, they cannot perform the action
    if user_role_hierarchy_level is null then
        return false;
    end if;

    -- Get the hierarchy level of the target role
    select
        hierarchy_level into target_role_hierarchy_level
    from
        public.roles
    where
        name = role_name;

    -- If the target role does not exist, the user cannot perform the action
    if target_role_hierarchy_level is null then
        return false;
    end if;

   -- check the user's role hierarchy level is the same as the target role
    return user_role_hierarchy_level = target_role_hierarchy_level;

end;

$function$
;



CREATE OR REPLACE FUNCTION public.is_account_owner(account_id uuid)
 RETURNS boolean
 LANGUAGE sql
 SET search_path TO ''
AS $function$
    select
        exists(
            select
                1
            from
                public.accounts
            where
                id = is_account_owner.account_id
                and primary_owner_user_id = auth.uid());
$function$
;

CREATE OR REPLACE FUNCTION public.is_account_team_member(target_account_id uuid)
 RETURNS boolean
 LANGUAGE sql
 SET search_path TO ''
AS $function$
    select exists(
        select 1
        from public.accounts_memberships as membership
        where public.is_team_member (membership.account_id, target_account_id)
    );
$function$
;

CREATE OR REPLACE FUNCTION public.is_set(field_name text)
 RETURNS boolean
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
    result boolean;
begin
    execute format('select %I from public.config limit 1', field_name) into result;

    return result;

end;

$function$
;

CREATE OR REPLACE FUNCTION public.is_team_member(account_id uuid, user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
    select
        exists(
            select
                1
            from
                public.accounts_memberships membership
            where
                public.has_role_on_account(account_id)
                and membership.user_id = is_team_member.user_id
                and membership.account_id = is_team_member.account_id);
$function$
;

CREATE OR REPLACE FUNCTION public.team_account_workspace(account_slug text)
 RETURNS TABLE(id uuid, name character varying, picture_url character varying, slug text, role character varying, role_hierarchy_level integer, primary_owner_user_id uuid, subscription_status subscription_status, permissions app_permissions[])
 LANGUAGE plpgsql
AS $function$
begin
    return QUERY
    select
        accounts.id,
        accounts.name,
        accounts.picture_url,
        accounts.slug,
        accounts_memberships.account_role,
        roles.hierarchy_level,
        accounts.primary_owner_user_id,
        subscriptions.status,
        array_agg(role_permissions.permission)
    from
        public.accounts
        join public.accounts_memberships on accounts.id = accounts_memberships.account_id
        left join public.subscriptions on accounts.id = subscriptions.account_id
        join public.roles on accounts_memberships.account_role = roles.name
        left join public.role_permissions on accounts_memberships.account_role = role_permissions.role
    where
        accounts.slug = account_slug
        and public.accounts_memberships.user_id = (select auth.uid())
    group by
        accounts.id,
        accounts_memberships.account_role,
        subscriptions.status,
        roles.hierarchy_level;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.transfer_team_account_ownership(target_account_id uuid, new_owner_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
    if current_user not in('service_role') then
        raise exception 'You do not have permission to transfer account ownership';
    end if;

    -- verify the user is already a member of the account
    if not exists(
        select
            1
        from
            public.accounts_memberships
        where
            target_account_id = account_id
            and user_id = new_owner_id) then
        raise exception 'The new owner must be a member of the account';
    end if;

    -- update the primary owner of the account
    update
        public.accounts
    set
        primary_owner_user_id = new_owner_id
    where
        id = target_account_id
        and is_personal_account = false;

    -- update membership assigning it the hierarchy role
    update
        public.accounts_memberships
    set
        account_role =(
            public.get_upper_system_role())
    where
        target_account_id = account_id
        and user_id = new_owner_id
        and account_role <>(
            public.get_upper_system_role());

end;

$function$
;

CREATE OR REPLACE FUNCTION public.trigger_set_timestamps()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
    if TG_OP = 'INSERT' then
        new.created_at = now();

        new.updated_at = now();

    else
        new.updated_at = now();

        new.created_at = old.created_at;

    end if;

    return NEW;

end
$function$
;

CREATE OR REPLACE FUNCTION public.trigger_set_user_tracking()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
    if TG_OP = 'INSERT' then
        new.created_by = auth.uid();
        new.updated_by = auth.uid();

    else
        new.updated_by = auth.uid();

        new.created_by = old.created_by;

    end if;

    return NEW;

end
$function$
;

CREATE OR REPLACE FUNCTION public.upsert_order(target_account_id uuid, target_customer_id character varying, target_order_id text, status payment_status, billing_provider billing_provider, total_amount numeric, currency character varying, line_items jsonb)
 RETURNS orders
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
    new_order public.orders;
    new_billing_customer_id int;
begin
    insert into public.billing_customers(
        account_id,
        provider,
        customer_id)
    values (
        target_account_id,
        billing_provider,
        target_customer_id)
on conflict (
    account_id,
    provider,
    customer_id)
    do update set
        provider = excluded.provider
    returning
        id into new_billing_customer_id;

    insert into public.orders(
        account_id,
        billing_customer_id,
        id,
        status,
        billing_provider,
        total_amount,
        currency)
    values (
        target_account_id,
        new_billing_customer_id,
        target_order_id,
        status,
        billing_provider,
        total_amount,
        currency)
on conflict (
    id)
    do update set
        status = excluded.status,
        total_amount = excluded.total_amount,
        currency = excluded.currency
    returning
        * into new_order;

    -- Upsert order items and delete ones that are not in the line_items array
    with item_data as (
        select
            (line_item ->> 'id')::varchar as line_item_id,
            (line_item ->> 'product_id')::varchar as prod_id,
            (line_item ->> 'variant_id')::varchar as var_id,
            (line_item ->> 'price_amount')::numeric as price_amt,
            (line_item ->> 'quantity')::integer as qty
        from
            jsonb_array_elements(line_items) as line_item
    ),
    line_item_ids as (
        select line_item_id from item_data
    ),
    deleted_items as (
        delete from
            public.order_items
        where
            public.order_items.order_id = new_order.id
            and public.order_items.id not in (select line_item_id from line_item_ids)
        returning *
    )
    insert into public.order_items(
        id,
        order_id,
        product_id,
        variant_id,
        price_amount,
        quantity)
    select
        line_item_id,
        target_order_id,
        prod_id,
        var_id,
        price_amt,
        qty
    from
        item_data
    on conflict (id)
        do update set
            price_amount = excluded.price_amount,
            quantity = excluded.quantity;

    return new_order;

end;

$function$
;

CREATE OR REPLACE FUNCTION public.upsert_subscription(target_account_id uuid, target_customer_id character varying, target_subscription_id text, active boolean, status subscription_status, billing_provider billing_provider, cancel_at_period_end boolean, currency character varying, period_starts_at timestamp with time zone, period_ends_at timestamp with time zone, line_items jsonb, trial_starts_at timestamp with time zone DEFAULT NULL::timestamp with time zone, trial_ends_at timestamp with time zone DEFAULT NULL::timestamp with time zone)
 RETURNS subscriptions
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
    new_subscription public.subscriptions;
    new_billing_customer_id int;
begin
    insert into public.billing_customers(
        account_id,
        provider,
        customer_id)
    values (
        target_account_id,
        billing_provider,
        target_customer_id)
on conflict (
    account_id,
    provider,
    customer_id)
    do update set
        provider = excluded.provider
    returning
        id into new_billing_customer_id;

    insert into public.subscriptions(
        account_id,
        billing_customer_id,
        id,
        active,
        status,
        billing_provider,
        cancel_at_period_end,
        currency,
        period_starts_at,
        period_ends_at,
        trial_starts_at,
        trial_ends_at)
    values (
        target_account_id,
        new_billing_customer_id,
        target_subscription_id,
        active,
        status,
        billing_provider,
        cancel_at_period_end,
        currency,
        period_starts_at,
        period_ends_at,
        trial_starts_at,
        trial_ends_at)
on conflict (
    id)
    do update set
        active = excluded.active,
        status = excluded.status,
        cancel_at_period_end = excluded.cancel_at_period_end,
        currency = excluded.currency,
        period_starts_at = excluded.period_starts_at,
        period_ends_at = excluded.period_ends_at,
        trial_starts_at = excluded.trial_starts_at,
        trial_ends_at = excluded.trial_ends_at
    returning
        * into new_subscription;

    -- Upsert subscription items and delete ones that are not in the line_items array
    with item_data as (
        select
            (line_item ->> 'id')::varchar as line_item_id,
            (line_item ->> 'product_id')::varchar as prod_id,
            (line_item ->> 'variant_id')::varchar as var_id,
            (line_item ->> 'type')::public.subscription_item_type as type,
            (line_item ->> 'price_amount')::numeric as price_amt,
            (line_item ->> 'quantity')::integer as qty,
            (line_item ->> 'interval')::varchar as intv,
            (line_item ->> 'interval_count')::integer as intv_count
        from
            jsonb_array_elements(line_items) as line_item
    ),
    line_item_ids as (
        select line_item_id from item_data
    ),
    deleted_items as (
        delete from
            public.subscription_items
        where
            public.subscription_items.subscription_id = new_subscription.id
            and public.subscription_items.id not in (select line_item_id from line_item_ids)
        returning *
    )
    insert into public.subscription_items(
        id,
        subscription_id,
        product_id,
        variant_id,
        type,
        price_amount,
        quantity,
        interval,
        interval_count)
    select
        line_item_id,
        target_subscription_id,
        prod_id,
        var_id,
        type,
        price_amt,
        qty,
        intv,
        intv_count
    from
        item_data
    on conflict (id)
        do update set
            price_amount = excluded.price_amount,
            quantity = excluded.quantity,
            interval = excluded.interval,
            interval_count = excluded.interval_count;

    return new_subscription;

end;

$function$
;

create or replace view "public"."user_account_workspace" as  SELECT accounts.id,
    accounts.name,
    accounts.picture_url,
    ( SELECT subscriptions.status
           FROM subscriptions
          WHERE (subscriptions.account_id = accounts.id)
         LIMIT 1) AS subscription_status
   FROM accounts
  WHERE ((accounts.primary_owner_user_id = ( SELECT auth.uid() AS uid)) AND (accounts.is_personal_account = true))
 LIMIT 1;


create or replace view "public"."user_accounts" as  SELECT account.id,
    account.name,
    account.picture_url,
    account.slug,
    membership.account_role AS role
   FROM (accounts account
     JOIN accounts_memberships membership ON ((account.id = membership.account_id)))
  WHERE ((membership.user_id = ( SELECT auth.uid() AS uid)) AND (account.is_personal_account = false) AND (account.id IN ( SELECT accounts_memberships.account_id
           FROM accounts_memberships
          WHERE (accounts_memberships.user_id = ( SELECT auth.uid() AS uid)))));


grant delete on table "public"."accounts" to "anon";

grant insert on table "public"."accounts" to "anon";

grant references on table "public"."accounts" to "anon";

grant select on table "public"."accounts" to "anon";

grant trigger on table "public"."accounts" to "anon";

grant truncate on table "public"."accounts" to "anon";

grant update on table "public"."accounts" to "anon";

grant delete on table "public"."accounts" to "authenticated";

grant insert on table "public"."accounts" to "authenticated";

grant select on table "public"."accounts" to "authenticated";

grant update on table "public"."accounts" to "authenticated";

grant delete on table "public"."accounts" to "service_role";

grant insert on table "public"."accounts" to "service_role";

grant select on table "public"."accounts" to "service_role";

grant update on table "public"."accounts" to "service_role";

grant delete on table "public"."accounts_memberships" to "anon";

grant insert on table "public"."accounts_memberships" to "anon";

grant references on table "public"."accounts_memberships" to "anon";

grant select on table "public"."accounts_memberships" to "anon";

grant trigger on table "public"."accounts_memberships" to "anon";

grant truncate on table "public"."accounts_memberships" to "anon";

grant update on table "public"."accounts_memberships" to "anon";

grant delete on table "public"."accounts_memberships" to "authenticated";

grant insert on table "public"."accounts_memberships" to "authenticated";

grant select on table "public"."accounts_memberships" to "authenticated";

grant update on table "public"."accounts_memberships" to "authenticated";

grant delete on table "public"."accounts_memberships" to "service_role";

grant insert on table "public"."accounts_memberships" to "service_role";

grant select on table "public"."accounts_memberships" to "service_role";

grant update on table "public"."accounts_memberships" to "service_role";

grant delete on table "public"."app_store_link_clicked" to "anon";

grant insert on table "public"."app_store_link_clicked" to "anon";

grant references on table "public"."app_store_link_clicked" to "anon";

grant select on table "public"."app_store_link_clicked" to "anon";

grant trigger on table "public"."app_store_link_clicked" to "anon";

grant truncate on table "public"."app_store_link_clicked" to "anon";

grant update on table "public"."app_store_link_clicked" to "anon";

grant delete on table "public"."app_store_link_clicked" to "authenticated";

grant insert on table "public"."app_store_link_clicked" to "authenticated";

grant references on table "public"."app_store_link_clicked" to "authenticated";

grant select on table "public"."app_store_link_clicked" to "authenticated";

grant trigger on table "public"."app_store_link_clicked" to "authenticated";

grant truncate on table "public"."app_store_link_clicked" to "authenticated";

grant update on table "public"."app_store_link_clicked" to "authenticated";

grant delete on table "public"."app_store_link_clicked" to "service_role";

grant insert on table "public"."app_store_link_clicked" to "service_role";

grant references on table "public"."app_store_link_clicked" to "service_role";

grant select on table "public"."app_store_link_clicked" to "service_role";

grant trigger on table "public"."app_store_link_clicked" to "service_role";

grant truncate on table "public"."app_store_link_clicked" to "service_role";

grant update on table "public"."app_store_link_clicked" to "service_role";

grant delete on table "public"."apple_login_button_clicked" to "anon";

grant insert on table "public"."apple_login_button_clicked" to "anon";

grant references on table "public"."apple_login_button_clicked" to "anon";

grant select on table "public"."apple_login_button_clicked" to "anon";

grant trigger on table "public"."apple_login_button_clicked" to "anon";

grant truncate on table "public"."apple_login_button_clicked" to "anon";

grant update on table "public"."apple_login_button_clicked" to "anon";

grant delete on table "public"."apple_login_button_clicked" to "authenticated";

grant insert on table "public"."apple_login_button_clicked" to "authenticated";

grant references on table "public"."apple_login_button_clicked" to "authenticated";

grant select on table "public"."apple_login_button_clicked" to "authenticated";

grant trigger on table "public"."apple_login_button_clicked" to "authenticated";

grant truncate on table "public"."apple_login_button_clicked" to "authenticated";

grant update on table "public"."apple_login_button_clicked" to "authenticated";

grant delete on table "public"."apple_login_button_clicked" to "service_role";

grant insert on table "public"."apple_login_button_clicked" to "service_role";

grant references on table "public"."apple_login_button_clicked" to "service_role";

grant select on table "public"."apple_login_button_clicked" to "service_role";

grant trigger on table "public"."apple_login_button_clicked" to "service_role";

grant truncate on table "public"."apple_login_button_clicked" to "service_role";

grant update on table "public"."apple_login_button_clicked" to "service_role";

grant delete on table "public"."apple_music" to "anon";

grant insert on table "public"."apple_music" to "anon";

grant references on table "public"."apple_music" to "anon";

grant select on table "public"."apple_music" to "anon";

grant trigger on table "public"."apple_music" to "anon";

grant truncate on table "public"."apple_music" to "anon";

grant update on table "public"."apple_music" to "anon";

grant delete on table "public"."apple_music" to "authenticated";

grant insert on table "public"."apple_music" to "authenticated";

grant references on table "public"."apple_music" to "authenticated";

grant select on table "public"."apple_music" to "authenticated";

grant trigger on table "public"."apple_music" to "authenticated";

grant truncate on table "public"."apple_music" to "authenticated";

grant update on table "public"."apple_music" to "authenticated";

grant delete on table "public"."apple_music" to "service_role";

grant insert on table "public"."apple_music" to "service_role";

grant references on table "public"."apple_music" to "service_role";

grant select on table "public"."apple_music" to "service_role";

grant trigger on table "public"."apple_music" to "service_role";

grant truncate on table "public"."apple_music" to "service_role";

grant update on table "public"."apple_music" to "service_role";

grant delete on table "public"."apple_play_button_clicked" to "anon";

grant insert on table "public"."apple_play_button_clicked" to "anon";

grant references on table "public"."apple_play_button_clicked" to "anon";

grant select on table "public"."apple_play_button_clicked" to "anon";

grant trigger on table "public"."apple_play_button_clicked" to "anon";

grant truncate on table "public"."apple_play_button_clicked" to "anon";

grant update on table "public"."apple_play_button_clicked" to "anon";

grant delete on table "public"."apple_play_button_clicked" to "authenticated";

grant insert on table "public"."apple_play_button_clicked" to "authenticated";

grant references on table "public"."apple_play_button_clicked" to "authenticated";

grant select on table "public"."apple_play_button_clicked" to "authenticated";

grant trigger on table "public"."apple_play_button_clicked" to "authenticated";

grant truncate on table "public"."apple_play_button_clicked" to "authenticated";

grant update on table "public"."apple_play_button_clicked" to "authenticated";

grant delete on table "public"."apple_play_button_clicked" to "service_role";

grant insert on table "public"."apple_play_button_clicked" to "service_role";

grant references on table "public"."apple_play_button_clicked" to "service_role";

grant select on table "public"."apple_play_button_clicked" to "service_role";

grant trigger on table "public"."apple_play_button_clicked" to "service_role";

grant truncate on table "public"."apple_play_button_clicked" to "service_role";

grant update on table "public"."apple_play_button_clicked" to "service_role";

grant delete on table "public"."artists" to "anon";

grant insert on table "public"."artists" to "anon";

grant references on table "public"."artists" to "anon";

grant select on table "public"."artists" to "anon";

grant trigger on table "public"."artists" to "anon";

grant truncate on table "public"."artists" to "anon";

grant update on table "public"."artists" to "anon";

grant delete on table "public"."artists" to "authenticated";

grant insert on table "public"."artists" to "authenticated";

grant references on table "public"."artists" to "authenticated";

grant select on table "public"."artists" to "authenticated";

grant trigger on table "public"."artists" to "authenticated";

grant truncate on table "public"."artists" to "authenticated";

grant update on table "public"."artists" to "authenticated";

grant delete on table "public"."artists" to "service_role";

grant insert on table "public"."artists" to "service_role";

grant references on table "public"."artists" to "service_role";

grant select on table "public"."artists" to "service_role";

grant trigger on table "public"."artists" to "service_role";

grant truncate on table "public"."artists" to "service_role";

grant update on table "public"."artists" to "service_role";

grant delete on table "public"."billing_customers" to "anon";

grant insert on table "public"."billing_customers" to "anon";

grant references on table "public"."billing_customers" to "anon";

grant select on table "public"."billing_customers" to "anon";

grant trigger on table "public"."billing_customers" to "anon";

grant truncate on table "public"."billing_customers" to "anon";

grant update on table "public"."billing_customers" to "anon";

grant select on table "public"."billing_customers" to "authenticated";

grant delete on table "public"."billing_customers" to "service_role";

grant insert on table "public"."billing_customers" to "service_role";

grant select on table "public"."billing_customers" to "service_role";

grant update on table "public"."billing_customers" to "service_role";

grant delete on table "public"."campaigns" to "anon";

grant insert on table "public"."campaigns" to "anon";

grant references on table "public"."campaigns" to "anon";

grant select on table "public"."campaigns" to "anon";

grant trigger on table "public"."campaigns" to "anon";

grant truncate on table "public"."campaigns" to "anon";

grant update on table "public"."campaigns" to "anon";

grant delete on table "public"."campaigns" to "authenticated";

grant insert on table "public"."campaigns" to "authenticated";

grant references on table "public"."campaigns" to "authenticated";

grant select on table "public"."campaigns" to "authenticated";

grant trigger on table "public"."campaigns" to "authenticated";

grant truncate on table "public"."campaigns" to "authenticated";

grant update on table "public"."campaigns" to "authenticated";

grant delete on table "public"."campaigns" to "service_role";

grant insert on table "public"."campaigns" to "service_role";

grant references on table "public"."campaigns" to "service_role";

grant select on table "public"."campaigns" to "service_role";

grant trigger on table "public"."campaigns" to "service_role";

grant truncate on table "public"."campaigns" to "service_role";

grant update on table "public"."campaigns" to "service_role";

grant delete on table "public"."chat_messages" to "anon";

grant insert on table "public"."chat_messages" to "anon";

grant references on table "public"."chat_messages" to "anon";

grant select on table "public"."chat_messages" to "anon";

grant trigger on table "public"."chat_messages" to "anon";

grant truncate on table "public"."chat_messages" to "anon";

grant update on table "public"."chat_messages" to "anon";

grant delete on table "public"."chat_messages" to "authenticated";

grant insert on table "public"."chat_messages" to "authenticated";

grant references on table "public"."chat_messages" to "authenticated";

grant select on table "public"."chat_messages" to "authenticated";

grant trigger on table "public"."chat_messages" to "authenticated";

grant truncate on table "public"."chat_messages" to "authenticated";

grant update on table "public"."chat_messages" to "authenticated";

grant delete on table "public"."chat_messages" to "service_role";

grant insert on table "public"."chat_messages" to "service_role";

grant references on table "public"."chat_messages" to "service_role";

grant select on table "public"."chat_messages" to "service_role";

grant trigger on table "public"."chat_messages" to "service_role";

grant truncate on table "public"."chat_messages" to "service_role";

grant update on table "public"."chat_messages" to "service_role";

grant delete on table "public"."chats" to "anon";

grant insert on table "public"."chats" to "anon";

grant references on table "public"."chats" to "anon";

grant select on table "public"."chats" to "anon";

grant trigger on table "public"."chats" to "anon";

grant truncate on table "public"."chats" to "anon";

grant update on table "public"."chats" to "anon";

grant delete on table "public"."chats" to "authenticated";

grant insert on table "public"."chats" to "authenticated";

grant references on table "public"."chats" to "authenticated";

grant select on table "public"."chats" to "authenticated";

grant trigger on table "public"."chats" to "authenticated";

grant truncate on table "public"."chats" to "authenticated";

grant update on table "public"."chats" to "authenticated";

grant delete on table "public"."chats" to "service_role";

grant insert on table "public"."chats" to "service_role";

grant references on table "public"."chats" to "service_role";

grant select on table "public"."chats" to "service_role";

grant trigger on table "public"."chats" to "service_role";

grant truncate on table "public"."chats" to "service_role";

grant update on table "public"."chats" to "service_role";

grant delete on table "public"."config" to "anon";

grant insert on table "public"."config" to "anon";

grant references on table "public"."config" to "anon";

grant select on table "public"."config" to "anon";

grant trigger on table "public"."config" to "anon";

grant truncate on table "public"."config" to "anon";

grant update on table "public"."config" to "anon";

grant select on table "public"."config" to "authenticated";

grant select on table "public"."config" to "service_role";

grant delete on table "public"."cookie_players" to "anon";

grant insert on table "public"."cookie_players" to "anon";

grant references on table "public"."cookie_players" to "anon";

grant select on table "public"."cookie_players" to "anon";

grant trigger on table "public"."cookie_players" to "anon";

grant truncate on table "public"."cookie_players" to "anon";

grant update on table "public"."cookie_players" to "anon";

grant delete on table "public"."cookie_players" to "authenticated";

grant insert on table "public"."cookie_players" to "authenticated";

grant references on table "public"."cookie_players" to "authenticated";

grant select on table "public"."cookie_players" to "authenticated";

grant trigger on table "public"."cookie_players" to "authenticated";

grant truncate on table "public"."cookie_players" to "authenticated";

grant update on table "public"."cookie_players" to "authenticated";

grant delete on table "public"."cookie_players" to "service_role";

grant insert on table "public"."cookie_players" to "service_role";

grant references on table "public"."cookie_players" to "service_role";

grant select on table "public"."cookie_players" to "service_role";

grant trigger on table "public"."cookie_players" to "service_role";

grant truncate on table "public"."cookie_players" to "service_role";

grant update on table "public"."cookie_players" to "service_role";

grant delete on table "public"."credits_usage" to "anon";

grant insert on table "public"."credits_usage" to "anon";

grant references on table "public"."credits_usage" to "anon";

grant select on table "public"."credits_usage" to "anon";

grant trigger on table "public"."credits_usage" to "anon";

grant truncate on table "public"."credits_usage" to "anon";

grant update on table "public"."credits_usage" to "anon";

grant delete on table "public"."credits_usage" to "authenticated";

grant insert on table "public"."credits_usage" to "authenticated";

grant references on table "public"."credits_usage" to "authenticated";

grant select on table "public"."credits_usage" to "authenticated";

grant trigger on table "public"."credits_usage" to "authenticated";

grant truncate on table "public"."credits_usage" to "authenticated";

grant update on table "public"."credits_usage" to "authenticated";

grant delete on table "public"."credits_usage" to "service_role";

grant insert on table "public"."credits_usage" to "service_role";

grant references on table "public"."credits_usage" to "service_role";

grant select on table "public"."credits_usage" to "service_role";

grant trigger on table "public"."credits_usage" to "service_role";

grant truncate on table "public"."credits_usage" to "service_role";

grant update on table "public"."credits_usage" to "service_role";

grant delete on table "public"."cta_redirect" to "anon";

grant insert on table "public"."cta_redirect" to "anon";

grant references on table "public"."cta_redirect" to "anon";

grant select on table "public"."cta_redirect" to "anon";

grant trigger on table "public"."cta_redirect" to "anon";

grant truncate on table "public"."cta_redirect" to "anon";

grant update on table "public"."cta_redirect" to "anon";

grant delete on table "public"."cta_redirect" to "authenticated";

grant insert on table "public"."cta_redirect" to "authenticated";

grant references on table "public"."cta_redirect" to "authenticated";

grant select on table "public"."cta_redirect" to "authenticated";

grant trigger on table "public"."cta_redirect" to "authenticated";

grant truncate on table "public"."cta_redirect" to "authenticated";

grant update on table "public"."cta_redirect" to "authenticated";

grant delete on table "public"."cta_redirect" to "service_role";

grant insert on table "public"."cta_redirect" to "service_role";

grant references on table "public"."cta_redirect" to "service_role";

grant select on table "public"."cta_redirect" to "service_role";

grant trigger on table "public"."cta_redirect" to "service_role";

grant truncate on table "public"."cta_redirect" to "service_role";

grant update on table "public"."cta_redirect" to "service_role";

grant delete on table "public"."fans" to "anon";

grant insert on table "public"."fans" to "anon";

grant references on table "public"."fans" to "anon";

grant select on table "public"."fans" to "anon";

grant trigger on table "public"."fans" to "anon";

grant truncate on table "public"."fans" to "anon";

grant update on table "public"."fans" to "anon";

grant delete on table "public"."fans" to "authenticated";

grant insert on table "public"."fans" to "authenticated";

grant references on table "public"."fans" to "authenticated";

grant select on table "public"."fans" to "authenticated";

grant trigger on table "public"."fans" to "authenticated";

grant truncate on table "public"."fans" to "authenticated";

grant update on table "public"."fans" to "authenticated";

grant delete on table "public"."fans" to "service_role";

grant insert on table "public"."fans" to "service_role";

grant references on table "public"."fans" to "service_role";

grant select on table "public"."fans" to "service_role";

grant trigger on table "public"."fans" to "service_role";

grant truncate on table "public"."fans" to "service_role";

grant update on table "public"."fans" to "service_role";

grant delete on table "public"."follows" to "anon";

grant insert on table "public"."follows" to "anon";

grant references on table "public"."follows" to "anon";

grant select on table "public"."follows" to "anon";

grant trigger on table "public"."follows" to "anon";

grant truncate on table "public"."follows" to "anon";

grant update on table "public"."follows" to "anon";

grant delete on table "public"."follows" to "authenticated";

grant insert on table "public"."follows" to "authenticated";

grant references on table "public"."follows" to "authenticated";

grant select on table "public"."follows" to "authenticated";

grant trigger on table "public"."follows" to "authenticated";

grant truncate on table "public"."follows" to "authenticated";

grant update on table "public"."follows" to "authenticated";

grant delete on table "public"."follows" to "service_role";

grant insert on table "public"."follows" to "service_role";

grant references on table "public"."follows" to "service_role";

grant select on table "public"."follows" to "service_role";

grant trigger on table "public"."follows" to "service_role";

grant truncate on table "public"."follows" to "service_role";

grant update on table "public"."follows" to "service_role";

grant delete on table "public"."game_start" to "anon";

grant insert on table "public"."game_start" to "anon";

grant references on table "public"."game_start" to "anon";

grant select on table "public"."game_start" to "anon";

grant trigger on table "public"."game_start" to "anon";

grant truncate on table "public"."game_start" to "anon";

grant update on table "public"."game_start" to "anon";

grant delete on table "public"."game_start" to "authenticated";

grant insert on table "public"."game_start" to "authenticated";

grant references on table "public"."game_start" to "authenticated";

grant select on table "public"."game_start" to "authenticated";

grant trigger on table "public"."game_start" to "authenticated";

grant truncate on table "public"."game_start" to "authenticated";

grant update on table "public"."game_start" to "authenticated";

grant delete on table "public"."game_start" to "service_role";

grant insert on table "public"."game_start" to "service_role";

grant references on table "public"."game_start" to "service_role";

grant select on table "public"."game_start" to "service_role";

grant trigger on table "public"."game_start" to "service_role";

grant truncate on table "public"."game_start" to "service_role";

grant update on table "public"."game_start" to "service_role";

grant delete on table "public"."invitations" to "anon";

grant insert on table "public"."invitations" to "anon";

grant references on table "public"."invitations" to "anon";

grant select on table "public"."invitations" to "anon";

grant trigger on table "public"."invitations" to "anon";

grant truncate on table "public"."invitations" to "anon";

grant update on table "public"."invitations" to "anon";

grant delete on table "public"."invitations" to "authenticated";

grant insert on table "public"."invitations" to "authenticated";

grant select on table "public"."invitations" to "authenticated";

grant update on table "public"."invitations" to "authenticated";

grant delete on table "public"."invitations" to "service_role";

grant insert on table "public"."invitations" to "service_role";

grant select on table "public"."invitations" to "service_role";

grant update on table "public"."invitations" to "service_role";

grant delete on table "public"."ios_redirect" to "anon";

grant insert on table "public"."ios_redirect" to "anon";

grant references on table "public"."ios_redirect" to "anon";

grant select on table "public"."ios_redirect" to "anon";

grant trigger on table "public"."ios_redirect" to "anon";

grant truncate on table "public"."ios_redirect" to "anon";

grant update on table "public"."ios_redirect" to "anon";

grant delete on table "public"."ios_redirect" to "authenticated";

grant insert on table "public"."ios_redirect" to "authenticated";

grant references on table "public"."ios_redirect" to "authenticated";

grant select on table "public"."ios_redirect" to "authenticated";

grant trigger on table "public"."ios_redirect" to "authenticated";

grant truncate on table "public"."ios_redirect" to "authenticated";

grant update on table "public"."ios_redirect" to "authenticated";

grant delete on table "public"."ios_redirect" to "service_role";

grant insert on table "public"."ios_redirect" to "service_role";

grant references on table "public"."ios_redirect" to "service_role";

grant select on table "public"."ios_redirect" to "service_role";

grant trigger on table "public"."ios_redirect" to "service_role";

grant truncate on table "public"."ios_redirect" to "service_role";

grant update on table "public"."ios_redirect" to "service_role";

grant delete on table "public"."leaderboard" to "anon";

grant insert on table "public"."leaderboard" to "anon";

grant references on table "public"."leaderboard" to "anon";

grant select on table "public"."leaderboard" to "anon";

grant trigger on table "public"."leaderboard" to "anon";

grant truncate on table "public"."leaderboard" to "anon";

grant update on table "public"."leaderboard" to "anon";

grant delete on table "public"."leaderboard" to "authenticated";

grant insert on table "public"."leaderboard" to "authenticated";

grant references on table "public"."leaderboard" to "authenticated";

grant select on table "public"."leaderboard" to "authenticated";

grant trigger on table "public"."leaderboard" to "authenticated";

grant truncate on table "public"."leaderboard" to "authenticated";

grant update on table "public"."leaderboard" to "authenticated";

grant delete on table "public"."leaderboard" to "service_role";

grant insert on table "public"."leaderboard" to "service_role";

grant references on table "public"."leaderboard" to "service_role";

grant select on table "public"."leaderboard" to "service_role";

grant trigger on table "public"."leaderboard" to "service_role";

grant truncate on table "public"."leaderboard" to "service_role";

grant update on table "public"."leaderboard" to "service_role";

grant delete on table "public"."leaderboard_boogie" to "anon";

grant insert on table "public"."leaderboard_boogie" to "anon";

grant references on table "public"."leaderboard_boogie" to "anon";

grant select on table "public"."leaderboard_boogie" to "anon";

grant trigger on table "public"."leaderboard_boogie" to "anon";

grant truncate on table "public"."leaderboard_boogie" to "anon";

grant update on table "public"."leaderboard_boogie" to "anon";

grant delete on table "public"."leaderboard_boogie" to "authenticated";

grant insert on table "public"."leaderboard_boogie" to "authenticated";

grant references on table "public"."leaderboard_boogie" to "authenticated";

grant select on table "public"."leaderboard_boogie" to "authenticated";

grant trigger on table "public"."leaderboard_boogie" to "authenticated";

grant truncate on table "public"."leaderboard_boogie" to "authenticated";

grant update on table "public"."leaderboard_boogie" to "authenticated";

grant delete on table "public"."leaderboard_boogie" to "service_role";

grant insert on table "public"."leaderboard_boogie" to "service_role";

grant references on table "public"."leaderboard_boogie" to "service_role";

grant select on table "public"."leaderboard_boogie" to "service_role";

grant trigger on table "public"."leaderboard_boogie" to "service_role";

grant truncate on table "public"."leaderboard_boogie" to "service_role";

grant update on table "public"."leaderboard_boogie" to "service_role";

grant delete on table "public"."leaderboard_luh_tyler_3d" to "anon";

grant insert on table "public"."leaderboard_luh_tyler_3d" to "anon";

grant references on table "public"."leaderboard_luh_tyler_3d" to "anon";

grant select on table "public"."leaderboard_luh_tyler_3d" to "anon";

grant trigger on table "public"."leaderboard_luh_tyler_3d" to "anon";

grant truncate on table "public"."leaderboard_luh_tyler_3d" to "anon";

grant update on table "public"."leaderboard_luh_tyler_3d" to "anon";

grant delete on table "public"."leaderboard_luh_tyler_3d" to "authenticated";

grant insert on table "public"."leaderboard_luh_tyler_3d" to "authenticated";

grant references on table "public"."leaderboard_luh_tyler_3d" to "authenticated";

grant select on table "public"."leaderboard_luh_tyler_3d" to "authenticated";

grant trigger on table "public"."leaderboard_luh_tyler_3d" to "authenticated";

grant truncate on table "public"."leaderboard_luh_tyler_3d" to "authenticated";

grant update on table "public"."leaderboard_luh_tyler_3d" to "authenticated";

grant delete on table "public"."leaderboard_luh_tyler_3d" to "service_role";

grant insert on table "public"."leaderboard_luh_tyler_3d" to "service_role";

grant references on table "public"."leaderboard_luh_tyler_3d" to "service_role";

grant select on table "public"."leaderboard_luh_tyler_3d" to "service_role";

grant trigger on table "public"."leaderboard_luh_tyler_3d" to "service_role";

grant truncate on table "public"."leaderboard_luh_tyler_3d" to "service_role";

grant update on table "public"."leaderboard_luh_tyler_3d" to "service_role";

grant delete on table "public"."leaderboard_luv" to "anon";

grant insert on table "public"."leaderboard_luv" to "anon";

grant references on table "public"."leaderboard_luv" to "anon";

grant select on table "public"."leaderboard_luv" to "anon";

grant trigger on table "public"."leaderboard_luv" to "anon";

grant truncate on table "public"."leaderboard_luv" to "anon";

grant update on table "public"."leaderboard_luv" to "anon";

grant delete on table "public"."leaderboard_luv" to "authenticated";

grant insert on table "public"."leaderboard_luv" to "authenticated";

grant references on table "public"."leaderboard_luv" to "authenticated";

grant select on table "public"."leaderboard_luv" to "authenticated";

grant trigger on table "public"."leaderboard_luv" to "authenticated";

grant truncate on table "public"."leaderboard_luv" to "authenticated";

grant update on table "public"."leaderboard_luv" to "authenticated";

grant delete on table "public"."leaderboard_luv" to "service_role";

grant insert on table "public"."leaderboard_luv" to "service_role";

grant references on table "public"."leaderboard_luv" to "service_role";

grant select on table "public"."leaderboard_luv" to "service_role";

grant trigger on table "public"."leaderboard_luv" to "service_role";

grant truncate on table "public"."leaderboard_luv" to "service_role";

grant update on table "public"."leaderboard_luv" to "service_role";

grant delete on table "public"."notifications" to "anon";

grant insert on table "public"."notifications" to "anon";

grant references on table "public"."notifications" to "anon";

grant select on table "public"."notifications" to "anon";

grant trigger on table "public"."notifications" to "anon";

grant truncate on table "public"."notifications" to "anon";

grant update on table "public"."notifications" to "anon";

grant select on table "public"."notifications" to "authenticated";

grant update on table "public"."notifications" to "authenticated";

grant insert on table "public"."notifications" to "service_role";

grant select on table "public"."notifications" to "service_role";

grant update on table "public"."notifications" to "service_role";

grant delete on table "public"."order_items" to "anon";

grant insert on table "public"."order_items" to "anon";

grant references on table "public"."order_items" to "anon";

grant select on table "public"."order_items" to "anon";

grant trigger on table "public"."order_items" to "anon";

grant truncate on table "public"."order_items" to "anon";

grant update on table "public"."order_items" to "anon";

grant select on table "public"."order_items" to "authenticated";

grant delete on table "public"."order_items" to "service_role";

grant insert on table "public"."order_items" to "service_role";

grant select on table "public"."order_items" to "service_role";

grant update on table "public"."order_items" to "service_role";

grant delete on table "public"."orders" to "anon";

grant insert on table "public"."orders" to "anon";

grant references on table "public"."orders" to "anon";

grant select on table "public"."orders" to "anon";

grant trigger on table "public"."orders" to "anon";

grant truncate on table "public"."orders" to "anon";

grant update on table "public"."orders" to "anon";

grant select on table "public"."orders" to "authenticated";

grant delete on table "public"."orders" to "service_role";

grant insert on table "public"."orders" to "service_role";

grant select on table "public"."orders" to "service_role";

grant update on table "public"."orders" to "service_role";

grant delete on table "public"."plans" to "anon";

grant insert on table "public"."plans" to "anon";

grant references on table "public"."plans" to "anon";

grant select on table "public"."plans" to "anon";

grant trigger on table "public"."plans" to "anon";

grant truncate on table "public"."plans" to "anon";

grant update on table "public"."plans" to "anon";

grant delete on table "public"."plans" to "authenticated";

grant insert on table "public"."plans" to "authenticated";

grant references on table "public"."plans" to "authenticated";

grant select on table "public"."plans" to "authenticated";

grant trigger on table "public"."plans" to "authenticated";

grant truncate on table "public"."plans" to "authenticated";

grant update on table "public"."plans" to "authenticated";

grant delete on table "public"."plans" to "service_role";

grant insert on table "public"."plans" to "service_role";

grant references on table "public"."plans" to "service_role";

grant select on table "public"."plans" to "service_role";

grant trigger on table "public"."plans" to "service_role";

grant truncate on table "public"."plans" to "service_role";

grant update on table "public"."plans" to "service_role";

grant delete on table "public"."popup_open" to "anon";

grant insert on table "public"."popup_open" to "anon";

grant references on table "public"."popup_open" to "anon";

grant select on table "public"."popup_open" to "anon";

grant trigger on table "public"."popup_open" to "anon";

grant truncate on table "public"."popup_open" to "anon";

grant update on table "public"."popup_open" to "anon";

grant delete on table "public"."popup_open" to "authenticated";

grant insert on table "public"."popup_open" to "authenticated";

grant references on table "public"."popup_open" to "authenticated";

grant select on table "public"."popup_open" to "authenticated";

grant trigger on table "public"."popup_open" to "authenticated";

grant truncate on table "public"."popup_open" to "authenticated";

grant update on table "public"."popup_open" to "authenticated";

grant delete on table "public"."popup_open" to "service_role";

grant insert on table "public"."popup_open" to "service_role";

grant references on table "public"."popup_open" to "service_role";

grant select on table "public"."popup_open" to "service_role";

grant trigger on table "public"."popup_open" to "service_role";

grant truncate on table "public"."popup_open" to "service_role";

grant update on table "public"."popup_open" to "service_role";

grant delete on table "public"."presave" to "anon";

grant insert on table "public"."presave" to "anon";

grant references on table "public"."presave" to "anon";

grant select on table "public"."presave" to "anon";

grant trigger on table "public"."presave" to "anon";

grant truncate on table "public"."presave" to "anon";

grant update on table "public"."presave" to "anon";

grant delete on table "public"."presave" to "authenticated";

grant insert on table "public"."presave" to "authenticated";

grant references on table "public"."presave" to "authenticated";

grant select on table "public"."presave" to "authenticated";

grant trigger on table "public"."presave" to "authenticated";

grant truncate on table "public"."presave" to "authenticated";

grant update on table "public"."presave" to "authenticated";

grant delete on table "public"."presave" to "service_role";

grant insert on table "public"."presave" to "service_role";

grant references on table "public"."presave" to "service_role";

grant select on table "public"."presave" to "service_role";

grant trigger on table "public"."presave" to "service_role";

grant truncate on table "public"."presave" to "service_role";

grant update on table "public"."presave" to "service_role";

grant delete on table "public"."role_permissions" to "anon";

grant insert on table "public"."role_permissions" to "anon";

grant references on table "public"."role_permissions" to "anon";

grant select on table "public"."role_permissions" to "anon";

grant trigger on table "public"."role_permissions" to "anon";

grant truncate on table "public"."role_permissions" to "anon";

grant update on table "public"."role_permissions" to "anon";

grant select on table "public"."role_permissions" to "authenticated";

grant delete on table "public"."role_permissions" to "service_role";

grant insert on table "public"."role_permissions" to "service_role";

grant select on table "public"."role_permissions" to "service_role";

grant update on table "public"."role_permissions" to "service_role";

grant delete on table "public"."roles" to "anon";

grant insert on table "public"."roles" to "anon";

grant references on table "public"."roles" to "anon";

grant select on table "public"."roles" to "anon";

grant trigger on table "public"."roles" to "anon";

grant truncate on table "public"."roles" to "anon";

grant update on table "public"."roles" to "anon";

grant select on table "public"."roles" to "authenticated";

grant select on table "public"."roles" to "service_role";

grant delete on table "public"."save_track" to "anon";

grant insert on table "public"."save_track" to "anon";

grant references on table "public"."save_track" to "anon";

grant select on table "public"."save_track" to "anon";

grant trigger on table "public"."save_track" to "anon";

grant truncate on table "public"."save_track" to "anon";

grant update on table "public"."save_track" to "anon";

grant delete on table "public"."save_track" to "authenticated";

grant insert on table "public"."save_track" to "authenticated";

grant references on table "public"."save_track" to "authenticated";

grant select on table "public"."save_track" to "authenticated";

grant trigger on table "public"."save_track" to "authenticated";

grant truncate on table "public"."save_track" to "authenticated";

grant update on table "public"."save_track" to "authenticated";

grant delete on table "public"."save_track" to "service_role";

grant insert on table "public"."save_track" to "service_role";

grant references on table "public"."save_track" to "service_role";

grant select on table "public"."save_track" to "service_role";

grant trigger on table "public"."save_track" to "service_role";

grant truncate on table "public"."save_track" to "service_role";

grant update on table "public"."save_track" to "service_role";

grant delete on table "public"."spotify" to "anon";

grant insert on table "public"."spotify" to "anon";

grant references on table "public"."spotify" to "anon";

grant select on table "public"."spotify" to "anon";

grant trigger on table "public"."spotify" to "anon";

grant truncate on table "public"."spotify" to "anon";

grant update on table "public"."spotify" to "anon";

grant delete on table "public"."spotify" to "authenticated";

grant insert on table "public"."spotify" to "authenticated";

grant references on table "public"."spotify" to "authenticated";

grant select on table "public"."spotify" to "authenticated";

grant trigger on table "public"."spotify" to "authenticated";

grant truncate on table "public"."spotify" to "authenticated";

grant update on table "public"."spotify" to "authenticated";

grant delete on table "public"."spotify" to "service_role";

grant insert on table "public"."spotify" to "service_role";

grant references on table "public"."spotify" to "service_role";

grant select on table "public"."spotify" to "service_role";

grant trigger on table "public"."spotify" to "service_role";

grant truncate on table "public"."spotify" to "service_role";

grant update on table "public"."spotify" to "service_role";

grant delete on table "public"."spotify_login_button_clicked" to "anon";

grant insert on table "public"."spotify_login_button_clicked" to "anon";

grant references on table "public"."spotify_login_button_clicked" to "anon";

grant select on table "public"."spotify_login_button_clicked" to "anon";

grant trigger on table "public"."spotify_login_button_clicked" to "anon";

grant truncate on table "public"."spotify_login_button_clicked" to "anon";

grant update on table "public"."spotify_login_button_clicked" to "anon";

grant delete on table "public"."spotify_login_button_clicked" to "authenticated";

grant insert on table "public"."spotify_login_button_clicked" to "authenticated";

grant references on table "public"."spotify_login_button_clicked" to "authenticated";

grant select on table "public"."spotify_login_button_clicked" to "authenticated";

grant trigger on table "public"."spotify_login_button_clicked" to "authenticated";

grant truncate on table "public"."spotify_login_button_clicked" to "authenticated";

grant update on table "public"."spotify_login_button_clicked" to "authenticated";

grant delete on table "public"."spotify_login_button_clicked" to "service_role";

grant insert on table "public"."spotify_login_button_clicked" to "service_role";

grant references on table "public"."spotify_login_button_clicked" to "service_role";

grant select on table "public"."spotify_login_button_clicked" to "service_role";

grant trigger on table "public"."spotify_login_button_clicked" to "service_role";

grant truncate on table "public"."spotify_login_button_clicked" to "service_role";

grant update on table "public"."spotify_login_button_clicked" to "service_role";

grant delete on table "public"."spotify_play_button_clicked" to "anon";

grant insert on table "public"."spotify_play_button_clicked" to "anon";

grant references on table "public"."spotify_play_button_clicked" to "anon";

grant select on table "public"."spotify_play_button_clicked" to "anon";

grant trigger on table "public"."spotify_play_button_clicked" to "anon";

grant truncate on table "public"."spotify_play_button_clicked" to "anon";

grant update on table "public"."spotify_play_button_clicked" to "anon";

grant delete on table "public"."spotify_play_button_clicked" to "authenticated";

grant insert on table "public"."spotify_play_button_clicked" to "authenticated";

grant references on table "public"."spotify_play_button_clicked" to "authenticated";

grant select on table "public"."spotify_play_button_clicked" to "authenticated";

grant trigger on table "public"."spotify_play_button_clicked" to "authenticated";

grant truncate on table "public"."spotify_play_button_clicked" to "authenticated";

grant update on table "public"."spotify_play_button_clicked" to "authenticated";

grant delete on table "public"."spotify_play_button_clicked" to "service_role";

grant insert on table "public"."spotify_play_button_clicked" to "service_role";

grant references on table "public"."spotify_play_button_clicked" to "service_role";

grant select on table "public"."spotify_play_button_clicked" to "service_role";

grant trigger on table "public"."spotify_play_button_clicked" to "service_role";

grant truncate on table "public"."spotify_play_button_clicked" to "service_role";

grant update on table "public"."spotify_play_button_clicked" to "service_role";

grant delete on table "public"."subscription_items" to "anon";

grant insert on table "public"."subscription_items" to "anon";

grant references on table "public"."subscription_items" to "anon";

grant select on table "public"."subscription_items" to "anon";

grant trigger on table "public"."subscription_items" to "anon";

grant truncate on table "public"."subscription_items" to "anon";

grant update on table "public"."subscription_items" to "anon";

grant select on table "public"."subscription_items" to "authenticated";

grant delete on table "public"."subscription_items" to "service_role";

grant insert on table "public"."subscription_items" to "service_role";

grant select on table "public"."subscription_items" to "service_role";

grant update on table "public"."subscription_items" to "service_role";

grant delete on table "public"."subscriptions" to "anon";

grant insert on table "public"."subscriptions" to "anon";

grant references on table "public"."subscriptions" to "anon";

grant select on table "public"."subscriptions" to "anon";

grant trigger on table "public"."subscriptions" to "anon";

grant truncate on table "public"."subscriptions" to "anon";

grant update on table "public"."subscriptions" to "anon";

grant select on table "public"."subscriptions" to "authenticated";

grant delete on table "public"."subscriptions" to "service_role";

grant insert on table "public"."subscriptions" to "service_role";

grant select on table "public"."subscriptions" to "service_role";

grant update on table "public"."subscriptions" to "service_role";

grant delete on table "public"."tasks" to "anon";

grant insert on table "public"."tasks" to "anon";

grant references on table "public"."tasks" to "anon";

grant select on table "public"."tasks" to "anon";

grant trigger on table "public"."tasks" to "anon";

grant truncate on table "public"."tasks" to "anon";

grant update on table "public"."tasks" to "anon";

grant delete on table "public"."tasks" to "authenticated";

grant insert on table "public"."tasks" to "authenticated";

grant references on table "public"."tasks" to "authenticated";

grant select on table "public"."tasks" to "authenticated";

grant trigger on table "public"."tasks" to "authenticated";

grant truncate on table "public"."tasks" to "authenticated";

grant update on table "public"."tasks" to "authenticated";

grant delete on table "public"."tasks" to "service_role";

grant insert on table "public"."tasks" to "service_role";

grant references on table "public"."tasks" to "service_role";

grant select on table "public"."tasks" to "service_role";

grant trigger on table "public"."tasks" to "service_role";

grant truncate on table "public"."tasks" to "service_role";

grant update on table "public"."tasks" to "service_role";

create policy "accounts_read"
on "public"."accounts"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) = primary_owner_user_id) OR has_role_on_account(id) OR is_account_team_member(id)));


create policy "accounts_self_update"
on "public"."accounts"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = primary_owner_user_id))
with check ((( SELECT auth.uid() AS uid) = primary_owner_user_id));


create policy "create_org_account"
on "public"."accounts"
as permissive
for insert
to authenticated
with check ((is_set('enable_team_accounts'::text) AND (is_personal_account = false)));


create policy "accounts_memberships_delete"
on "public"."accounts_memberships"
as permissive
for delete
to authenticated
using (((user_id = ( SELECT auth.uid() AS uid)) OR can_action_account_member(account_id, user_id)));


create policy "accounts_memberships_read"
on "public"."accounts_memberships"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) = user_id) OR is_team_member(account_id, user_id)));


create policy "billing_customers_read_self"
on "public"."billing_customers"
as permissive
for select
to authenticated
using (((account_id = ( SELECT auth.uid() AS uid)) OR has_role_on_account(account_id)));


create policy "delete_chat_messages"
on "public"."chat_messages"
as permissive
for delete
to authenticated
using (has_role_on_account(account_id));


create policy "select_chat_messages"
on "public"."chat_messages"
as permissive
for select
to authenticated
using (has_role_on_account(account_id));


create policy "delete_chats"
on "public"."chats"
as permissive
for delete
to authenticated
using (has_role_on_account(account_id));


create policy "insert_chats"
on "public"."chats"
as permissive
for insert
to authenticated
with check ((has_role_on_account(account_id) AND has_credits(account_id)));


create policy "select_chats"
on "public"."chats"
as permissive
for select
to authenticated
using (has_role_on_account(account_id));


create policy "update_chats"
on "public"."chats"
as permissive
for update
to authenticated
using (has_role_on_account(account_id));


create policy "public config can be read by authenticated users"
on "public"."config"
as permissive
for select
to authenticated
using (true);


create policy "select_credits_usage"
on "public"."credits_usage"
as permissive
for select
to authenticated
using (has_role_on_account(account_id));


create policy "Allow super-admin access to all fans"
on "public"."fans"
as permissive
for select
to public
using (((auth.jwt() ->> 'role'::text) = 'super-admin'::text));


create policy "invitations_create_self"
on "public"."invitations"
as permissive
for insert
to authenticated
with check ((is_set('enable_team_accounts'::text) AND has_permission(( SELECT auth.uid() AS uid), account_id, 'invites.manage'::app_permissions) AND has_same_role_hierarchy_level(( SELECT auth.uid() AS uid), account_id, role)));


create policy "invitations_delete"
on "public"."invitations"
as permissive
for delete
to authenticated
using ((has_role_on_account(account_id) AND has_permission(( SELECT auth.uid() AS uid), account_id, 'invites.manage'::app_permissions)));


create policy "invitations_read_self"
on "public"."invitations"
as permissive
for select
to authenticated
using (has_role_on_account(account_id));


create policy "invitations_update"
on "public"."invitations"
as permissive
for update
to authenticated
using ((has_permission(( SELECT auth.uid() AS uid), account_id, 'invites.manage'::app_permissions) AND has_more_elevated_role(( SELECT auth.uid() AS uid), account_id, role)))
with check ((has_permission(( SELECT auth.uid() AS uid), account_id, 'invites.manage'::app_permissions) AND has_more_elevated_role(( SELECT auth.uid() AS uid), account_id, role)));


create policy "notifications_read_self"
on "public"."notifications"
as permissive
for select
to authenticated
using (((account_id = ( SELECT auth.uid() AS uid)) OR has_role_on_account(account_id)));


create policy "notifications_update_self"
on "public"."notifications"
as permissive
for update
to authenticated
using (((account_id = ( SELECT auth.uid() AS uid)) OR has_role_on_account(account_id)));


create policy "order_items_read_self"
on "public"."order_items"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM orders
  WHERE ((orders.id = order_items.order_id) AND ((orders.account_id = ( SELECT auth.uid() AS uid)) OR has_role_on_account(orders.account_id))))));


create policy "orders_read_self"
on "public"."orders"
as permissive
for select
to authenticated
using ((((account_id = ( SELECT auth.uid() AS uid)) AND is_set('enable_account_billing'::text)) OR (has_role_on_account(account_id) AND is_set('enable_team_account_billing'::text))));


create policy "select_plans"
on "public"."plans"
as permissive
for select
to authenticated
using (true);


create policy "role_permissions_read"
on "public"."role_permissions"
as permissive
for select
to authenticated
using (true);


create policy "roles_read"
on "public"."roles"
as permissive
for select
to authenticated
using (true);


create policy "subscription_items_read_self"
on "public"."subscription_items"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM subscriptions
  WHERE ((subscriptions.id = subscription_items.subscription_id) AND ((subscriptions.account_id = ( SELECT auth.uid() AS uid)) OR has_role_on_account(subscriptions.account_id))))));


create policy "subscriptions_read_self"
on "public"."subscriptions"
as permissive
for select
to authenticated
using (((has_role_on_account(account_id) AND is_set('enable_team_account_billing'::text)) OR ((account_id = ( SELECT auth.uid() AS uid)) AND is_set('enable_account_billing'::text))));


create policy "delete_tasks"
on "public"."tasks"
as permissive
for delete
to public
using (((account_id = ( SELECT auth.uid() AS uid)) OR has_permission(( SELECT auth.uid() AS uid), account_id, 'tasks.delete'::app_permissions)));


create policy "insert_tasks"
on "public"."tasks"
as permissive
for insert
to public
with check (((account_id = ( SELECT auth.uid() AS uid)) OR has_permission(( SELECT auth.uid() AS uid), account_id, 'tasks.write'::app_permissions)));


create policy "select_tasks"
on "public"."tasks"
as permissive
for select
to authenticated
using (((account_id = ( SELECT auth.uid() AS uid)) OR has_role_on_account(account_id)));


create policy "update_tasks"
on "public"."tasks"
as permissive
for update
to public
using (((account_id = ( SELECT auth.uid() AS uid)) OR has_permission(( SELECT auth.uid() AS uid), account_id, 'tasks.write'::app_permissions)));


CREATE TRIGGER add_current_user_to_new_account AFTER INSERT ON public.accounts FOR EACH ROW WHEN ((new.is_personal_account = false)) EXECUTE FUNCTION kit.add_current_user_to_new_account();

CREATE TRIGGER on_account_created_fill_credits AFTER INSERT ON public.accounts FOR EACH ROW WHEN ((new.is_personal_account = false)) EXECUTE FUNCTION kit.handle_new_account_credits_usage();

CREATE TRIGGER protect_account_fields BEFORE UPDATE ON public.accounts FOR EACH ROW EXECUTE FUNCTION kit.protect_account_fields();

CREATE TRIGGER set_slug_from_account_name BEFORE INSERT ON public.accounts FOR EACH ROW WHEN (((new.name IS NOT NULL) AND (new.slug IS NULL) AND (new.is_personal_account = false))) EXECUTE FUNCTION kit.set_slug_from_account_name();

CREATE TRIGGER update_slug_from_account_name BEFORE UPDATE ON public.accounts FOR EACH ROW WHEN (((new.name IS NOT NULL) AND ((new.name)::text <> (old.name)::text) AND (new.is_personal_account = false))) EXECUTE FUNCTION kit.set_slug_from_account_name();

CREATE TRIGGER prevent_account_owner_membership_delete_check BEFORE DELETE ON public.accounts_memberships FOR EACH ROW EXECUTE FUNCTION kit.prevent_account_owner_membership_delete();

CREATE TRIGGER prevent_memberships_update_check BEFORE UPDATE ON public.accounts_memberships FOR EACH ROW EXECUTE FUNCTION kit.prevent_memberships_update();

CREATE TRIGGER prevent_chats_update BEFORE UPDATE ON public.chats FOR EACH ROW EXECUTE FUNCTION kit.prevent_chats_update();

CREATE TRIGGER only_team_accounts_check BEFORE INSERT OR UPDATE ON public.invitations FOR EACH ROW EXECUTE FUNCTION kit.check_team_account();

CREATE TRIGGER update_notification_dismissed_status BEFORE UPDATE ON public.notifications FOR EACH ROW EXECUTE FUNCTION kit.update_notification_dismissed_status();


