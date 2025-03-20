alter table "public"."fan_segment" drop constraint "fan_segment_artist_id_fkey";

alter table "public"."fan_segment" add constraint "fan_segment_artist_id_fkey" FOREIGN KEY (artist_id) REFERENCES accounts(id) ON DELETE CASCADE not valid;

alter table "public"."fan_segment" validate constraint "fan_segment_artist_id_fkey";


