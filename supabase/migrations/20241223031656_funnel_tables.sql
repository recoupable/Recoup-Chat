create table "public"."funnel_analytics" (
    "id" uuid not null default gen_random_uuid(),
    "chat_id" uuid default gen_random_uuid(),
    "timestamp" timestamp without time zone default CURRENT_TIMESTAMP,
    "status" bigint default '0'::bigint
);

alter table "public"."funnel_analytics" enable row level security;

create table "public"."funnel_analytics_comments" (
    "id" uuid not null default gen_random_uuid(),
    "analysis_id" uuid default gen_random_uuid(),
    "username" text,
    "timestamp" bigint default '0'::bigint,
    "comment" text,
    "post_url" text,
    "type" social_type
);


alter table "public"."funnel_analytics_comments" enable row level security;

create table "public"."funnel_analytics_profile" (
    "id" uuid not null default gen_random_uuid(),
    "analysis_id" uuid default gen_random_uuid(),
    "name" text,
    "nickname" text,
    "region" text,
    "avatar" text,
    "bio" text,
    "followers" bigint,
    "followings" bigint,
    "type" social_type
);


alter table "public"."funnel_analytics_profile" enable row level security;

create table "public"."funnel_reports" (
    "id" uuid not null default gen_random_uuid(),
    "timestamp" timestamp with time zone not null default now(),
    "summary" text,
    "next_steps" text,
    "report" text,
    "stack_unique_id" text,
    "type" social_type
);


alter table "public"."funnel_reports" enable row level security;

create table "public"."spotify_analytics_albums" (
    "id" uuid not null default gen_random_uuid(),
    "uri" text,
    "name" text,
    "popularity" bigint default '0'::bigint,
    "release_date" bigint default '0'::bigint,
    "created_at" timestamp with time zone not null default now(),
    "analysis_id" uuid default gen_random_uuid()
);


alter table "public"."spotify_analytics_albums" enable row level security;

create table "public"."spotify_analytics_tracks" (
    "id" uuid not null default gen_random_uuid(),
    "uri" text,
    "name" text,
    "popularity" bigint default '0'::bigint,
    "artist_name" text,
    "created_at" timestamp with time zone not null default now(),
    "analysis_id" uuid default gen_random_uuid()
);


alter table "public"."spotify_analytics_tracks" enable row level security;

alter table "public"."funnel_analytics" add column if not exists "status" bigint default '0'::bigint;

CREATE UNIQUE INDEX funnel_analysis_comments_pkey ON public.funnel_analytics_profile USING btree (id);

CREATE UNIQUE INDEX funnel_analysis_comments_pkey1 ON public.funnel_analytics_comments USING btree (id);

CREATE UNIQUE INDEX funnel_analysis_pkey ON public.funnel_analytics USING btree (id);

CREATE UNIQUE INDEX funnel_reports_pkey ON public.funnel_reports USING btree (id);

CREATE UNIQUE INDEX spotify_analytics_albums_pkey ON public.spotify_analytics_albums USING btree (id);

CREATE UNIQUE INDEX spotify_analytics_tracks_pkey ON public.spotify_analytics_tracks USING btree (id);

alter table "public"."funnel_analytics" add constraint "funnel_analysis_pkey" PRIMARY KEY using index "funnel_analysis_pkey";

alter table "public"."funnel_analytics_comments" add constraint "funnel_analysis_comments_pkey1" PRIMARY KEY using index "funnel_analysis_comments_pkey1";

alter table "public"."funnel_analytics_profile" add constraint "funnel_analysis_comments_pkey" PRIMARY KEY using index "funnel_analysis_comments_pkey";

alter table "public"."funnel_reports" add constraint "funnel_reports_pkey" PRIMARY KEY using index "funnel_reports_pkey";

alter table "public"."spotify_analytics_albums" add constraint "spotify_analytics_albums_pkey" PRIMARY KEY using index "spotify_analytics_albums_pkey";

alter table "public"."spotify_analytics_tracks" add constraint "spotify_analytics_tracks_pkey" PRIMARY KEY using index "spotify_analytics_tracks_pkey";

alter table "public"."funnel_analytics_comments" add constraint "funnel_analysis_comments_analysis_id_fkey1" FOREIGN KEY (analysis_id) REFERENCES funnel_analytics(id) ON DELETE CASCADE not valid;

alter table "public"."funnel_analytics_comments" validate constraint "funnel_analysis_comments_analysis_id_fkey1";

alter table "public"."funnel_analytics_profile" add constraint "funnel_analysis_comments_analysis_id_fkey" FOREIGN KEY (analysis_id) REFERENCES funnel_analytics(id) ON DELETE CASCADE not valid;

alter table "public"."funnel_analytics_profile" validate constraint "funnel_analysis_comments_analysis_id_fkey";

alter table "public"."spotify_analytics_albums" add constraint "spotify_analytics_albums_analysis_id_fkey" FOREIGN KEY (analysis_id) REFERENCES funnel_analytics(id) ON DELETE CASCADE not valid;

alter table "public"."spotify_analytics_albums" validate constraint "spotify_analytics_albums_analysis_id_fkey";

alter table "public"."spotify_analytics_tracks" add constraint "spotify_analytics_tracks_analysis_id_fkey" FOREIGN KEY (analysis_id) REFERENCES funnel_analytics(id) ON DELETE CASCADE not valid;

alter table "public"."spotify_analytics_tracks" validate constraint "spotify_analytics_tracks_analysis_id_fkey";


