CREATE TABLE IF NOT EXISTS "public"."artists" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "name" text
);

CREATE TABLE IF NOT EXISTS "public"."campaigns" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "clientId" text,
    "artistId" uuid NOT NULL DEFAULT gen_random_uuid(),
    PRIMARY KEY ("id")
);

INSERT INTO "public"."artists" ("id", "name") 
VALUES ('00000000-0000-0000-0000-000000000000', 'virtual_artist');

INSERT INTO "public"."campaigns" ("id", "clientId", "artistId") 
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'virtual_campaign',
    '00000000-0000-0000-0000-000000000000'
);

-- fans --
create table if not exists "public"."fans" (
    "id" uuid not null default gen_random_uuid(),
    "clientId" text
);

ALTER TABLE "public"."fans" DROP COLUMN IF EXISTS "campaignId";

ALTER TABLE "public"."fans"  ADD COLUMN "campaignId" uuid default '00000000-0000-0000-0000-000000000000';

UPDATE "public"."fans" SET "campaignId" = 'b658c81f-fab7-48e2-9284-d3a85e49304a' WHERE "clientId" = 'LUHTYLER';

-- apple_login_button_clicked
create table if not exists "public"."apple_login_button_clicked" (
    "id" uuid not null default gen_random_uuid(),
    "clientId" text
);

ALTER TABLE "public"."apple_login_button_clicked" DROP COLUMN IF EXISTS "campaignId";

ALTER TABLE "public"."apple_login_button_clicked" ADD COLUMN IF NOT EXISTS "campaignId" uuid default '00000000-0000-0000-0000-000000000000';

UPDATE "public"."apple_login_button_clicked" SET "campaignId" = 'b658c81f-fab7-48e2-9284-d3a85e49304a' WHERE "clientId" = 'LUHTYLER';

-- apple_play_button_clicked --
create table if not exists "public"."apple_play_button_clicked" (
    "id" uuid not null default gen_random_uuid(),
    "clientId" text
);

ALTER TABLE "public"."apple_play_button_clicked" DROP COLUMN IF EXISTS "campaignId";

ALTER TABLE "public"."apple_play_button_clicked" ADD COLUMN IF NOT EXISTS "campaignId" uuid default '00000000-0000-0000-0000-000000000000';

UPDATE "public"."apple_play_button_clicked" SET "campaignId" = 'b658c81f-fab7-48e2-9284-d3a85e49304a' WHERE "clientId" = 'LUHTYLER';

-- popup_open --
create table if not exists "public"."popup_open" (
    "id" uuid not null default gen_random_uuid(),
    "clientId" text
);

ALTER TABLE "public"."popup_open" DROP COLUMN IF EXISTS "campaignId";

ALTER TABLE "public"."popup_open"  ADD COLUMN IF NOT EXISTS "campaignId" uuid default '00000000-0000-0000-0000-000000000000';

UPDATE "public"."popup_open" SET "campaignId" = 'b658c81f-fab7-48e2-9284-d3a85e49304a' WHERE "clientId" = 'LUHTYLER';

-- spotify_login_button_clicked
create table if not exists "public"."spotify_login_button_clicked" (
    "id" uuid not null default gen_random_uuid(),
    "clientId" text
);

ALTER TABLE "public"."spotify_login_button_clicked" DROP COLUMN IF EXISTS "campaignId";

ALTER TABLE "public"."spotify_login_button_clicked" ADD COLUMN IF NOT EXISTS "campaignId" uuid default '00000000-0000-0000-0000-000000000000';

UPDATE "public"."spotify_login_button_clicked" SET "campaignId" = 'b658c81f-fab7-48e2-9284-d3a85e49304a' WHERE "clientId" = 'LUHTYLER';

-- spotify_play_button_clicked --
create table if not exists "public"."spotify_play_button_clicked" (
    "id" uuid not null default gen_random_uuid(),
    "clientId" text
);

ALTER TABLE "public"."spotify_play_button_clicked" DROP COLUMN IF EXISTS "campaignId";

ALTER TABLE "public"."spotify_play_button_clicked" ADD COLUMN IF NOT EXISTS "campaignId" uuid default '00000000-0000-0000-0000-000000000000';

UPDATE "public"."spotify_play_button_clicked" SET "campaignId" = 'b658c81f-fab7-48e2-9284-d3a85e49304a' WHERE "clientId" = 'LUHTYLER';

alter table "public"."apple_login_button_clicked" add constraint "apple_login_button_clicked_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES campaigns(id) ON UPDATE CASCADE not valid;

alter table "public"."apple_login_button_clicked" validate constraint "apple_login_button_clicked_campaignId_fkey";

alter table "public"."apple_play_button_clicked" add constraint "apple_play_button_clicked_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES campaigns(id) ON UPDATE CASCADE not valid;

alter table "public"."apple_play_button_clicked" validate constraint "apple_play_button_clicked_campaignId_fkey";

alter table "public"."fans" add constraint "fans_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES campaigns(id) ON UPDATE CASCADE not valid;

alter table "public"."fans" validate constraint "fans_campaignId_fkey";

alter table "public"."spotify_login_button_clicked" add constraint "spotify_login_button_clicked_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES campaigns(id) ON UPDATE CASCADE not valid;

alter table "public"."spotify_login_button_clicked" validate constraint "spotify_login_button_clicked_campaignId_fkey";

alter table "public"."spotify_play_button_clicked" add constraint "spotify_play_button_clicked_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES campaigns(id) ON UPDATE CASCADE not valid;

alter table "public"."spotify_play_button_clicked" validate constraint "spotify_play_button_clicked_campaignId_fkey";


