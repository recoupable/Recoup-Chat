create table "public"."tiktok_reports" (
    "id" uuid not null default gen_random_uuid(),
    "timestamp" timestamp with time zone not null default now(),
    "summary" text,
    "next_steps" text,
    "report" text,
    "stack_unique_id" text
);

alter table "public"."tiktok_reports" enable row level security;

CREATE UNIQUE INDEX tiktok_reports_pkey ON public.tiktok_reports USING btree (id);

alter table "public"."tiktok_reports" add constraint "tiktok_reports_pkey" PRIMARY KEY using index "tiktok_reports_pkey";

