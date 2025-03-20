create table if not exists "public"."fans" (
    "id" uuid not null default gen_random_uuid(),
     "clientId" text
);

alter table "public"."fans" add column "genres" jsonb default '[]'::jsonb;


