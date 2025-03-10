alter table "public"."artists" add column "knowledges" jsonb default '[]'::jsonb;

alter table "public"."artists" add column "label" text;

alter table "public"."artists" add column "instruction" text;


