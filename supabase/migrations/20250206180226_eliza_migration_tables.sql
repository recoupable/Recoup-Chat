drop table if exists "public"."chat_messages";

drop table if exists "public"."chats";

create table "public"."memories" (
    "id" uuid not null default gen_random_uuid(),
    "room_id" uuid default gen_random_uuid(),
    "content" jsonb not null,
    "artist_id" uuid default gen_random_uuid(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."memories" enable row level security;

create table "public"."room_reports" (
    "id" uuid not null default gen_random_uuid(),
    "room_id" uuid default gen_random_uuid(),
    "report_id" uuid not null default gen_random_uuid()
);


alter table "public"."room_reports" enable row level security;

create table "public"."rooms" (
    "id" uuid not null default gen_random_uuid(),
    "account_id" uuid default gen_random_uuid(),
    "topic" text,
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."rooms" enable row level security;

CREATE UNIQUE INDEX memories_pkey ON public.memories USING btree (id);

CREATE UNIQUE INDEX room_reports_pkey ON public.room_reports USING btree (id);

CREATE UNIQUE INDEX rooms_pkey ON public.rooms USING btree (id);

alter table "public"."memories" add constraint "memories_pkey" PRIMARY KEY using index "memories_pkey";

alter table "public"."room_reports" add constraint "room_reports_pkey" PRIMARY KEY using index "room_reports_pkey";

alter table "public"."rooms" add constraint "rooms_pkey" PRIMARY KEY using index "rooms_pkey";

alter table "public"."memories" add constraint "memories_artist_id_fkey" FOREIGN KEY (artist_id) REFERENCES accounts(id) ON DELETE CASCADE not valid;

alter table "public"."memories" validate constraint "memories_artist_id_fkey";

alter table "public"."memories" add constraint "memories_room_id_fkey" FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE not valid;

alter table "public"."memories" validate constraint "memories_room_id_fkey";

alter table "public"."room_reports" add constraint "room_reports_report_id_fkey" FOREIGN KEY (report_id) REFERENCES segment_reports(id) ON DELETE CASCADE not valid;

alter table "public"."room_reports" validate constraint "room_reports_report_id_fkey";

alter table "public"."room_reports" add constraint "room_reports_room_id_fkey" FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE not valid;

alter table "public"."room_reports" validate constraint "room_reports_room_id_fkey";

grant delete on table "public"."memories" to "anon";

grant insert on table "public"."memories" to "anon";

grant references on table "public"."memories" to "anon";

grant select on table "public"."memories" to "anon";

grant trigger on table "public"."memories" to "anon";

grant truncate on table "public"."memories" to "anon";

grant update on table "public"."memories" to "anon";

grant delete on table "public"."memories" to "authenticated";

grant insert on table "public"."memories" to "authenticated";

grant references on table "public"."memories" to "authenticated";

grant select on table "public"."memories" to "authenticated";

grant trigger on table "public"."memories" to "authenticated";

grant truncate on table "public"."memories" to "authenticated";

grant update on table "public"."memories" to "authenticated";

grant delete on table "public"."memories" to "service_role";

grant insert on table "public"."memories" to "service_role";

grant references on table "public"."memories" to "service_role";

grant select on table "public"."memories" to "service_role";

grant trigger on table "public"."memories" to "service_role";

grant truncate on table "public"."memories" to "service_role";

grant update on table "public"."memories" to "service_role";

grant delete on table "public"."room_reports" to "anon";

grant insert on table "public"."room_reports" to "anon";

grant references on table "public"."room_reports" to "anon";

grant select on table "public"."room_reports" to "anon";

grant trigger on table "public"."room_reports" to "anon";

grant truncate on table "public"."room_reports" to "anon";

grant update on table "public"."room_reports" to "anon";

grant delete on table "public"."room_reports" to "authenticated";

grant insert on table "public"."room_reports" to "authenticated";

grant references on table "public"."room_reports" to "authenticated";

grant select on table "public"."room_reports" to "authenticated";

grant trigger on table "public"."room_reports" to "authenticated";

grant truncate on table "public"."room_reports" to "authenticated";

grant update on table "public"."room_reports" to "authenticated";

grant delete on table "public"."room_reports" to "service_role";

grant insert on table "public"."room_reports" to "service_role";

grant references on table "public"."room_reports" to "service_role";

grant select on table "public"."room_reports" to "service_role";

grant trigger on table "public"."room_reports" to "service_role";

grant truncate on table "public"."room_reports" to "service_role";

grant update on table "public"."room_reports" to "service_role";

grant delete on table "public"."rooms" to "anon";

grant insert on table "public"."rooms" to "anon";

grant references on table "public"."rooms" to "anon";

grant select on table "public"."rooms" to "anon";

grant trigger on table "public"."rooms" to "anon";

grant truncate on table "public"."rooms" to "anon";

grant update on table "public"."rooms" to "anon";

grant delete on table "public"."rooms" to "authenticated";

grant insert on table "public"."rooms" to "authenticated";

grant references on table "public"."rooms" to "authenticated";

grant select on table "public"."rooms" to "authenticated";

grant trigger on table "public"."rooms" to "authenticated";

grant truncate on table "public"."rooms" to "authenticated";

grant update on table "public"."rooms" to "authenticated";

grant delete on table "public"."rooms" to "service_role";

grant insert on table "public"."rooms" to "service_role";

grant references on table "public"."rooms" to "service_role";

grant select on table "public"."rooms" to "service_role";

grant trigger on table "public"."rooms" to "service_role";

grant truncate on table "public"."rooms" to "service_role";

grant update on table "public"."rooms" to "service_role";

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON rooms
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at(); 

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON memories
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at(); 

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON room_reports
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at(); 