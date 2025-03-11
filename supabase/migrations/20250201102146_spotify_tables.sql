create table "public"."social_spotify_albums" (
    "id" uuid not null default gen_random_uuid(),
    "social_id" uuid default gen_random_uuid(),
    "album_id" uuid default gen_random_uuid(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."social_spotify_albums" enable row level security;

create table "public"."social_spotify_tracks" (
    "id" uuid not null default gen_random_uuid(),
    "social_id" uuid not null default gen_random_uuid(),
    "track_id" uuid default gen_random_uuid(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."social_spotify_tracks" enable row level security;

create table "public"."spotify_albums" (
    "id" uuid not null default gen_random_uuid(),
    "name" text default ''::text,
    "uri" text not null,
    "release_date" text,
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."spotify_albums" enable row level security;

create table "public"."spotify_tracks" (
    "id" uuid not null default gen_random_uuid(),
    "uri" text not null,
    "name" text,
    "pupularity" bigint default '0'::bigint,
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."spotify_tracks" enable row level security;

CREATE UNIQUE INDEX social_spotify_albums_pkey ON public.social_spotify_albums USING btree (id);

CREATE UNIQUE INDEX social_spotify_tracks_pkey ON public.social_spotify_tracks USING btree (id);

CREATE UNIQUE INDEX spotify_albums_pkey ON public.spotify_albums USING btree (id);

CREATE UNIQUE INDEX spotify_albums_uri_key ON public.spotify_albums USING btree (uri);

CREATE UNIQUE INDEX spotify_tracks_pkey ON public.spotify_tracks USING btree (id);

CREATE UNIQUE INDEX spotify_tracks_uri_key ON public.spotify_tracks USING btree (uri);

alter table "public"."social_spotify_albums" add constraint "social_spotify_albums_pkey" PRIMARY KEY using index "social_spotify_albums_pkey";

alter table "public"."social_spotify_tracks" add constraint "social_spotify_tracks_pkey" PRIMARY KEY using index "social_spotify_tracks_pkey";

alter table "public"."spotify_albums" add constraint "spotify_albums_pkey" PRIMARY KEY using index "spotify_albums_pkey";

alter table "public"."spotify_tracks" add constraint "spotify_tracks_pkey" PRIMARY KEY using index "spotify_tracks_pkey";

alter table "public"."social_spotify_albums" add constraint "social_spotify_albums_album_id_fkey" FOREIGN KEY (album_id) REFERENCES spotify_albums(id) ON DELETE CASCADE not valid;

alter table "public"."social_spotify_albums" validate constraint "social_spotify_albums_album_id_fkey";

alter table "public"."social_spotify_albums" add constraint "social_spotify_albums_social_id_fkey" FOREIGN KEY (social_id) REFERENCES socials(id) ON DELETE CASCADE not valid;

alter table "public"."social_spotify_albums" validate constraint "social_spotify_albums_social_id_fkey";

alter table "public"."social_spotify_tracks" add constraint "social_spotify_tracks_social_id_fkey" FOREIGN KEY (social_id) REFERENCES socials(id) ON DELETE CASCADE not valid;

alter table "public"."social_spotify_tracks" validate constraint "social_spotify_tracks_social_id_fkey";

alter table "public"."social_spotify_tracks" add constraint "social_spotify_tracks_track_id_fkey" FOREIGN KEY (track_id) REFERENCES spotify_tracks(id) ON DELETE CASCADE not valid;

alter table "public"."social_spotify_tracks" validate constraint "social_spotify_tracks_track_id_fkey";

alter table "public"."spotify_albums" add constraint "spotify_albums_uri_key" UNIQUE using index "spotify_albums_uri_key";

alter table "public"."spotify_tracks" add constraint "spotify_tracks_uri_key" UNIQUE using index "spotify_tracks_uri_key";

grant delete on table "public"."social_spotify_albums" to "anon";

grant insert on table "public"."social_spotify_albums" to "anon";

grant references on table "public"."social_spotify_albums" to "anon";

grant select on table "public"."social_spotify_albums" to "anon";

grant trigger on table "public"."social_spotify_albums" to "anon";

grant truncate on table "public"."social_spotify_albums" to "anon";

grant update on table "public"."social_spotify_albums" to "anon";

grant delete on table "public"."social_spotify_albums" to "authenticated";

grant insert on table "public"."social_spotify_albums" to "authenticated";

grant references on table "public"."social_spotify_albums" to "authenticated";

grant select on table "public"."social_spotify_albums" to "authenticated";

grant trigger on table "public"."social_spotify_albums" to "authenticated";

grant truncate on table "public"."social_spotify_albums" to "authenticated";

grant update on table "public"."social_spotify_albums" to "authenticated";

grant delete on table "public"."social_spotify_albums" to "service_role";

grant insert on table "public"."social_spotify_albums" to "service_role";

grant references on table "public"."social_spotify_albums" to "service_role";

grant select on table "public"."social_spotify_albums" to "service_role";

grant trigger on table "public"."social_spotify_albums" to "service_role";

grant truncate on table "public"."social_spotify_albums" to "service_role";

grant update on table "public"."social_spotify_albums" to "service_role";

grant delete on table "public"."social_spotify_tracks" to "anon";

grant insert on table "public"."social_spotify_tracks" to "anon";

grant references on table "public"."social_spotify_tracks" to "anon";

grant select on table "public"."social_spotify_tracks" to "anon";

grant trigger on table "public"."social_spotify_tracks" to "anon";

grant truncate on table "public"."social_spotify_tracks" to "anon";

grant update on table "public"."social_spotify_tracks" to "anon";

grant delete on table "public"."social_spotify_tracks" to "authenticated";

grant insert on table "public"."social_spotify_tracks" to "authenticated";

grant references on table "public"."social_spotify_tracks" to "authenticated";

grant select on table "public"."social_spotify_tracks" to "authenticated";

grant trigger on table "public"."social_spotify_tracks" to "authenticated";

grant truncate on table "public"."social_spotify_tracks" to "authenticated";

grant update on table "public"."social_spotify_tracks" to "authenticated";

grant delete on table "public"."social_spotify_tracks" to "service_role";

grant insert on table "public"."social_spotify_tracks" to "service_role";

grant references on table "public"."social_spotify_tracks" to "service_role";

grant select on table "public"."social_spotify_tracks" to "service_role";

grant trigger on table "public"."social_spotify_tracks" to "service_role";

grant truncate on table "public"."social_spotify_tracks" to "service_role";

grant update on table "public"."social_spotify_tracks" to "service_role";

grant delete on table "public"."spotify_albums" to "anon";

grant insert on table "public"."spotify_albums" to "anon";

grant references on table "public"."spotify_albums" to "anon";

grant select on table "public"."spotify_albums" to "anon";

grant trigger on table "public"."spotify_albums" to "anon";

grant truncate on table "public"."spotify_albums" to "anon";

grant update on table "public"."spotify_albums" to "anon";

grant delete on table "public"."spotify_albums" to "authenticated";

grant insert on table "public"."spotify_albums" to "authenticated";

grant references on table "public"."spotify_albums" to "authenticated";

grant select on table "public"."spotify_albums" to "authenticated";

grant trigger on table "public"."spotify_albums" to "authenticated";

grant truncate on table "public"."spotify_albums" to "authenticated";

grant update on table "public"."spotify_albums" to "authenticated";

grant delete on table "public"."spotify_albums" to "service_role";

grant insert on table "public"."spotify_albums" to "service_role";

grant references on table "public"."spotify_albums" to "service_role";

grant select on table "public"."spotify_albums" to "service_role";

grant trigger on table "public"."spotify_albums" to "service_role";

grant truncate on table "public"."spotify_albums" to "service_role";

grant update on table "public"."spotify_albums" to "service_role";

grant delete on table "public"."spotify_tracks" to "anon";

grant insert on table "public"."spotify_tracks" to "anon";

grant references on table "public"."spotify_tracks" to "anon";

grant select on table "public"."spotify_tracks" to "anon";

grant trigger on table "public"."spotify_tracks" to "anon";

grant truncate on table "public"."spotify_tracks" to "anon";

grant update on table "public"."spotify_tracks" to "anon";

grant delete on table "public"."spotify_tracks" to "authenticated";

grant insert on table "public"."spotify_tracks" to "authenticated";

grant references on table "public"."spotify_tracks" to "authenticated";

grant select on table "public"."spotify_tracks" to "authenticated";

grant trigger on table "public"."spotify_tracks" to "authenticated";

grant truncate on table "public"."spotify_tracks" to "authenticated";

grant update on table "public"."spotify_tracks" to "authenticated";

grant delete on table "public"."spotify_tracks" to "service_role";

grant insert on table "public"."spotify_tracks" to "service_role";

grant references on table "public"."spotify_tracks" to "service_role";

grant select on table "public"."spotify_tracks" to "service_role";

grant trigger on table "public"."spotify_tracks" to "service_role";

grant truncate on table "public"."spotify_tracks" to "service_role";

grant update on table "public"."spotify_tracks" to "service_role";



CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON social_spotify_albums
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON social_spotify_tracks
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at(); 

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON spotify_albums
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at(); 

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON spotify_tracks
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at(); 