create table if not exists "public"."tiktok_analysis" (
    "id" uuid not null default gen_random_uuid(),
    "name" text,
    "avatar" text,
    "nickname" text,
    "videos" jsonb,
    "total_video_comments_count" integer,
    "segments" jsonb,
    "chat_id" uuid default gen_random_uuid()
);


alter table "public"."tiktok_analysis" enable row level security;

CREATE UNIQUE INDEX tiktok_analysis_pkey ON public.tiktok_analysis USING btree (id);

alter table "public"."tiktok_analysis" add constraint "tiktok_analysis_pkey" PRIMARY KEY using index "tiktok_analysis_pkey";