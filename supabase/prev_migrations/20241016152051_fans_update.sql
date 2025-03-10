drop index if exists "public"."idx_fans_heavy_rotations";

drop index if exists "public"."idx_fans_recently_played";

drop index if exists "public"."idx_fans_saved_audiobooks";

drop index if exists "public"."idx_fans_saved_shows";

alter table "public"."apple_play_button_clicked" drop column if exists "appleId";

alter table "public"."apple_play_button_clicked" add column "appleId" text;

alter table "public"."apple_play_button_clicked" drop column if exists "fanId";

alter table "public"."apple_play_button_clicked" add column "fanId" uuid default gen_random_uuid();

alter table "public"."apple_play_button_clicked" drop column if exists "id";

alter table "public"."apple_play_button_clicked" add column "id" uuid default gen_random_uuid();

alter table "public"."apple_play_button_clicked" alter column "id" set not null;

alter table "public"."fans" drop column if exists "heavy_rotations";

alter table "public"."fans" drop column if exists "recently_played";

alter table "public"."fans" drop column if exists "saved_audiobooks";

alter table "public"."fans" drop column if exists "saved_shows";

alter table "public"."fans" drop column if exists "followedArtists";

alter table "public"."fans" drop column if exists "savedAlbums";

alter table "public"."fans" drop column if exists "savedAudioBooks";

alter table "public"."fans" drop column if exists "savedShows";

alter table "public"."fans" drop column if exists "savedTracks";

alter table "public"."fans" drop column if exists "topArtists";

alter table "public"."fans" drop column if exists "topTracks";

alter table "public"."fans" add column if not exists "followedArtists" jsonb;

alter table "public"."fans" add column if not exists "savedAlbums" jsonb;

alter table "public"."fans" add column if not exists "savedAudioBooks" jsonb;

alter table "public"."fans" add column if not exists "savedShows" jsonb;

alter table "public"."fans" add column if not exists "savedTracks" jsonb;

alter table "public"."fans" add column if not exists "topArtists" jsonb;

alter table "public"."fans" add column if not exists "topTracks" jsonb;

alter table "public"."spotify_play_button_clicked" drop column if exists "isPremium";

alter table "public"."spotify_play_button_clicked" add column "isPremium" boolean;

alter table "public"."spotify_play_button_clicked" drop column if exists "fanId";

alter table "public"."spotify_play_button_clicked" add column "fanId" uuid default gen_random_uuid();

alter table "public"."spotify_play_button_clicked" drop column if exists "id";

alter table "public"."spotify_play_button_clicked" add column "id" uuid default gen_random_uuid();

alter table "public"."spotify_play_button_clicked" alter column "id" set not null;

CREATE UNIQUE INDEX apple_play_button_clicked_pkey ON public.apple_play_button_clicked USING btree (id);

CREATE UNIQUE INDEX spotify_play_button_clicked_pkey ON public.spotify_play_button_clicked USING btree (id);

alter table "public"."apple_play_button_clicked" add constraint "apple_play_button_clicked_pkey" PRIMARY KEY using index "apple_play_button_clicked_pkey";

alter table "public"."spotify_play_button_clicked" add constraint "spotify_play_button_clicked_pkey" PRIMARY KEY using index "spotify_play_button_clicked_pkey";

alter table "public"."spotify_play_button_clicked" add constraint "spotify_play_button_clicked_fanId_fkey" FOREIGN KEY ("fanId") REFERENCES fans(id) ON DELETE CASCADE not valid;