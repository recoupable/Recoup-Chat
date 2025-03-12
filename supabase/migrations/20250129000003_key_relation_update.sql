alter table "public"."account_phone_numbers" drop constraint "account_phone_numbers_account_id_fkey";

alter table "public"."artist_social_links" drop constraint "artist_social_links_artistId_fkey";

alter table "public"."account_phone_numbers" add constraint "account_phone_numbers_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(id) not valid;

alter table "public"."account_phone_numbers" validate constraint "account_phone_numbers_account_id_fkey";

alter table "public"."artist_social_links" add constraint "artist_social_links_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES artists(id) not valid;

alter table "public"."artist_social_links" validate constraint "artist_social_links_artistId_fkey";


