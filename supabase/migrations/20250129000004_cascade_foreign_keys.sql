alter table "public"."account_artist_ids" drop constraint "account_artist_ids_account_id_fkey";

alter table "public"."account_artist_ids" drop constraint "account_artist_ids_artist_id_fkey";

alter table "public"."account_phone_numbers" drop constraint "account_phone_numbers_account_id_fkey";

alter table "public"."artist_social_links" drop constraint "artist_social_links_artistId_fkey";

alter table "public"."fan_segment" drop constraint "fan_segment_account_id_fkey";

alter table "public"."fan_segment" drop constraint "fan_segment_artist_id_fkey";

alter table "public"."fans_segments" drop constraint "fans_segments_artistId_fkey";

alter table "public"."account_artist_ids" add constraint "account_artist_ids_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE not valid;

alter table "public"."account_artist_ids" validate constraint "account_artist_ids_account_id_fkey";

alter table "public"."account_artist_ids" add constraint "account_artist_ids_artist_id_fkey" FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE not valid;

alter table "public"."account_artist_ids" validate constraint "account_artist_ids_artist_id_fkey";

alter table "public"."account_phone_numbers" add constraint "account_phone_numbers_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE not valid;

alter table "public"."account_phone_numbers" validate constraint "account_phone_numbers_account_id_fkey";

alter table "public"."artist_social_links" add constraint "artist_social_links_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES artists(id) ON DELETE CASCADE not valid;

alter table "public"."artist_social_links" validate constraint "artist_social_links_artistId_fkey";

alter table "public"."fan_segment" add constraint "fan_segment_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE not valid;

alter table "public"."fan_segment" validate constraint "fan_segment_account_id_fkey";

alter table "public"."fan_segment" add constraint "fan_segment_artist_id_fkey" FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE not valid;

alter table "public"."fan_segment" validate constraint "fan_segment_artist_id_fkey";

alter table "public"."fans_segments" add constraint "fans_segments_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES artists(id) ON DELETE CASCADE not valid;

alter table "public"."fans_segments" validate constraint "fans_segments_artistId_fkey";


