alter table "public"."funnel_analytics_accounts" drop constraint "account_funnel_analytics_pkey";

drop index if exists "public"."account_funnel_analytics_pkey";

alter table "public"."account_socials" drop column "followerCount";
alter table "public"."account_socials" drop column "followingCount";
alter table "public"."funnel_analytics_accounts" drop column "id";


