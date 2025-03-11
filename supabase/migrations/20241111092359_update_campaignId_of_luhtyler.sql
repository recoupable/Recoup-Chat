create table if not exists "public"."fans" (
    "id" uuid not null default gen_random_uuid(),
     "clientId" text
);

ALTER TABLE "public"."fans"  ADD COLUMN "campaignId" TEXT;

UPDATE "public"."fans" SET "campaignId" = 'b658c81f-fab7-48e2-9284-d3a85e49304a' WHERE "clientId" = 'LUHTYLER';


