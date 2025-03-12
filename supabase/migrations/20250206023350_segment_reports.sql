create table "public"."segment_reports" (
    "id" uuid not null default gen_random_uuid(),
    "next_steps" text,
    "report" text,
    "artist_id" uuid default '00000000-0000-0000-0000-000000000000'::uuid,
    "updated_at" timestamp with time zone default now()
);


alter table "public"."segment_reports" enable row level security;

CREATE UNIQUE INDEX segment_reports_pkey ON public.segment_reports USING btree (id);

alter table "public"."segment_reports" add constraint "segment_reports_pkey" PRIMARY KEY using index "segment_reports_pkey";

alter table "public"."segment_reports" add constraint "segment_reports_artist_id_fkey" FOREIGN KEY (artist_id) REFERENCES accounts(id) ON DELETE CASCADE not valid;

alter table "public"."segment_reports" validate constraint "segment_reports_artist_id_fkey";

grant delete on table "public"."segment_reports" to "anon";

grant insert on table "public"."segment_reports" to "anon";

grant references on table "public"."segment_reports" to "anon";

grant select on table "public"."segment_reports" to "anon";

grant trigger on table "public"."segment_reports" to "anon";

grant truncate on table "public"."segment_reports" to "anon";

grant update on table "public"."segment_reports" to "anon";

grant delete on table "public"."segment_reports" to "authenticated";

grant insert on table "public"."segment_reports" to "authenticated";

grant references on table "public"."segment_reports" to "authenticated";

grant select on table "public"."segment_reports" to "authenticated";

grant trigger on table "public"."segment_reports" to "authenticated";

grant truncate on table "public"."segment_reports" to "authenticated";

grant update on table "public"."segment_reports" to "authenticated";

grant delete on table "public"."segment_reports" to "service_role";

grant insert on table "public"."segment_reports" to "service_role";

grant references on table "public"."segment_reports" to "service_role";

grant select on table "public"."segment_reports" to "service_role";

grant trigger on table "public"."segment_reports" to "service_role";

grant truncate on table "public"."segment_reports" to "service_role";

grant update on table "public"."segment_reports" to "service_role";

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON segment_reports
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at(); 


