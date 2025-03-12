alter table "public"."account_artist_ids" drop constraint "account_artist_ids_pkey";

alter table "public"."account_info" drop constraint "account_info_pkey";

drop index if exists "public"."account_artist_ids_pkey";

drop index if exists "public"."account_info_pkey";

alter table "public"."account_artist_ids" drop column "id";

alter table "public"."account_info" drop column "id";


