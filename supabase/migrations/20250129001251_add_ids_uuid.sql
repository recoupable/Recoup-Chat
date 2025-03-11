alter table "public"."account_artist_ids" add column "id" uuid not null default gen_random_uuid();

alter table "public"."account_info" add column "id" uuid not null default gen_random_uuid();

CREATE UNIQUE INDEX account_artist_ids_pkey ON public.account_artist_ids USING btree (id);

CREATE UNIQUE INDEX account_info_pkey ON public.account_info USING btree (id);

alter table "public"."account_artist_ids" add constraint "account_artist_ids_pkey" PRIMARY KEY using index "account_artist_ids_pkey";

alter table "public"."account_info" add constraint "account_info_pkey" PRIMARY KEY using index "account_info_pkey";


