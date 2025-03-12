alter table "public"."account_artist_ids" drop constraint "account_artist_ids_artist_id_fkey";

alter table "public"."account_artist_ids" add constraint "account_artist_ids_artist_id_fkey" FOREIGN KEY (artist_id) REFERENCES accounts(id) ON DELETE CASCADE not valid;

alter table "public"."account_artist_ids" validate constraint "account_artist_ids_artist_id_fkey";


