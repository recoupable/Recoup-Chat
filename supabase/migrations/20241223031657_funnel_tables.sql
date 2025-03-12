alter table "public"."funnel_analytics" add column if not exists "status" bigint default '0'::bigint;
