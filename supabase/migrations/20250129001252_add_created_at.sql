alter table "public"."account_info" add column "created_at" timestamp with time zone not null default now();

alter table "public"."account_emails" add column "created_at" timestamp with time zone not null default now();
