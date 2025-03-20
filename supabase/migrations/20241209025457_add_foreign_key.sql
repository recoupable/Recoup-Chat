create table if not exists "public"."accounts" (
    "id" uuid not null default gen_random_uuid(),
    "email" text,
    "artistIds" jsonb default '[]'::jsonb,
    PRIMARY KEY ("id")
);

create table if not exists "public"."credits_usage" (
    "id" uuid not null default gen_random_uuid(),
    "account_id" uuid
);

ALTER TABLE "public"."credits_usage" ADD COLUMN "timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

alter table "public"."credits_usage" add constraint "credits_usage_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(id) ON UPDATE CASCADE not valid;

alter table "public"."credits_usage" validate constraint "credits_usage_account_id_fkey";


