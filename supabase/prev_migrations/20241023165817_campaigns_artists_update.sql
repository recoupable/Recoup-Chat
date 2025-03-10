alter table "public"."artists" drop constraint "artists_account_id_fkey";

alter table "public"."artists" drop constraint "artists_pkey";

drop index if exists "public"."artists_pkey";

alter table "public"."artists" drop column "account_id";

alter table "public"."artists" drop column "artist_id";

alter table "public"."artists" drop column "created_at";

alter table "public"."artists" drop column "label_id";

alter table "public"."artists" add column "id" uuid not null default gen_random_uuid();

alter table "public"."artists" add column "timestamp" bigint;

alter table "public"."campaigns" drop column "created_at";

alter table "public"."campaigns" add column "artistId" uuid default gen_random_uuid();

alter table "public"."campaigns" add column "clientId" text;

alter table "public"."campaigns" add column "timestamp" bigint;

alter table "public"."campaigns" drop column if exists "id";

alter table "public"."campaigns" add column "id" uuid default gen_random_uuid();

CREATE UNIQUE INDEX artists_pkey ON public.artists USING btree (id);

alter table "public"."artists" add constraint "artists_pkey" PRIMARY KEY using index "artists_pkey";

alter table "public"."campaigns" add constraint "campaigns_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES artists(id) ON UPDATE CASCADE not valid;

alter table "public"."campaigns" validate constraint "campaigns_artistId_fkey";


