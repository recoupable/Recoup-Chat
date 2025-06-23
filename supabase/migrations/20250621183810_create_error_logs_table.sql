-- Create error_logs table for logging application errors
create table "public"."error_logs" (
    "id" uuid not null default gen_random_uuid(),
    "account_id" uuid,
    "room_id" uuid,
    "error_message" text,
    "error_timestamp" timestamp with time zone,
    "error_type" text,
    "last_message" text,
    "raw_message" text not null,
    "stack_trace" text,
    "telegram_message_id" bigint,
    "tool_name" text,
    "created_at" timestamp with time zone not null default now()
);

alter table "public"."error_logs" enable row level security;

CREATE UNIQUE INDEX error_logs_pkey ON public.error_logs USING btree (id);

alter table "public"."error_logs" add constraint "error_logs_pkey" PRIMARY KEY using index "error_logs_pkey";

-- Add foreign key constraints
alter table "public"."error_logs" add constraint "error_logs_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE not valid;

alter table "public"."error_logs" validate constraint "error_logs_account_id_fkey";

alter table "public"."error_logs" add constraint "error_logs_room_id_fkey" FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE not valid;

alter table "public"."error_logs" validate constraint "error_logs_room_id_fkey";

-- Grant permissions to different roles
grant delete on table "public"."error_logs" to "anon";

grant insert on table "public"."error_logs" to "anon";

grant references on table "public"."error_logs" to "anon";

grant select on table "public"."error_logs" to "anon";

grant trigger on table "public"."error_logs" to "anon";

grant truncate on table "public"."error_logs" to "anon";

grant update on table "public"."error_logs" to "anon";

grant delete on table "public"."error_logs" to "authenticated";

grant insert on table "public"."error_logs" to "authenticated";

grant references on table "public"."error_logs" to "authenticated";

grant select on table "public"."error_logs" to "authenticated";

grant trigger on table "public"."error_logs" to "authenticated";

grant truncate on table "public"."error_logs" to "authenticated";

grant update on table "public"."error_logs" to "authenticated";

grant delete on table "public"."error_logs" to "service_role";

grant insert on table "public"."error_logs" to "service_role";

grant references on table "public"."error_logs" to "service_role";

grant select on table "public"."error_logs" to "service_role";

grant trigger on table "public"."error_logs" to "service_role";

grant truncate on table "public"."error_logs" to "service_role";

grant update on table "public"."error_logs" to "service_role";

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON error_logs
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();