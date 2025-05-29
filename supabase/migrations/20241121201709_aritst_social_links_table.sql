create type "public"."social_type" as enum ('TIKTOK', 'YOUTUBE', 'INSTAGRAM', 'TWITTER', 'SPOTIFY', 'APPLE');

-- FIX: Drop the artists table if it exists (from README.md documented solution)
drop table if exists "public"."artists";

create table if not exists "public"."artists" (
    "id" uuid not null default gen_random_uuid(),
    "name" text,
    PRIMARY KEY ("id")
);
create table if not exists "public"."artist_social_links" (
    "id" uuid not null default gen_random_uuid(),
    "link" text,
    "type" social_type,
    "artistId" uuid not null,
    primary key ("id"),
    CONSTRAINT "artist_social_links_artistId_fkey" 
    foreign key ("artistId") 
    references "public"."artists" ("id")
    on delete cascade
);