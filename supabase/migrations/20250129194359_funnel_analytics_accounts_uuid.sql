alter table "public"."funnel_analytics_accounts" add column "id" uuid not null default gen_random_uuid();

CREATE UNIQUE INDEX funnel_analytics_accounts_pkey ON public.funnel_analytics_accounts USING btree (id);

alter table "public"."funnel_analytics_accounts" add constraint "funnel_analytics_accounts_pkey" PRIMARY KEY using index "funnel_analytics_accounts_pkey";

alter table "public"."account_socials" add column "followerCount" bigint default '0'::bigint;
alter table "public"."account_socials" add column "followingCount" bigint default '0'::bigint;
