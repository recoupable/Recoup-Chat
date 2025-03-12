alter table "public"."account_socials" add column "id" uuid not null default gen_random_uuid();

CREATE UNIQUE INDEX account_socials_pkey ON public.account_socials USING btree (id);

alter table "public"."account_socials" add constraint "account_socials_pkey" PRIMARY KEY using index "account_socials_pkey";

