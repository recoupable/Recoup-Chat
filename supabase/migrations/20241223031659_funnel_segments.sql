create table "public"."funnel_analytics_segments" (
    "id" uuid not null default gen_random_uuid(),
    "analysis_id" uuid default gen_random_uuid(),
    "size" bigint default '0'::bigint,
    "name" text,
    "icon" text,
    "created_at" timestamp with time zone not null default CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX funnel_analysis_segments_pkey ON public.funnel_analytics_segments USING btree (id);

alter table "public"."funnel_analytics_segments" add constraint "funnel_analysis_segments_pkey" PRIMARY KEY using index "funnel_analysis_segments_pkey";

alter table "public"."funnel_analytics_segments" add constraint "funnel_analytics_segments_analysis_id_fkey" FOREIGN KEY (analysis_id) REFERENCES funnel_analytics(id) ON DELETE CASCADE not valid;

alter table "public"."funnel_analytics_segments" validate constraint "funnel_analytics_segments_analysis_id_fkey";

