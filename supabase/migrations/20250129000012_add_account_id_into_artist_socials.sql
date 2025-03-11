alter table "public"."artist_social_links" rename TO "account_socials";

ALTER TABLE "public"."account_socials"  ADD COLUMN "account_id" uuid default '00000000-0000-0000-0000-000000000000';

alter table "public"."account_socials" add constraint "account_socials_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE not valid;

alter table "public"."account_socials" validate constraint "account_socials_account_id_fkey";


