-- Create error_logs table for logging errors from chat API
-- This table stores structured error data for monitoring and analysis
create table if not exists "public"."error_logs" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "raw_message" text,
    "telegram_message_id" bigint,
    "account_id" uuid,
    "room_id" uuid,
    "error_timestamp" timestamptz,
    "error_message" text not null,
    "error_type" text,
    "tool_name" text,
    "last_message" text,
    "stack_trace" text
);

-- Enable Row Level Security
alter table "public"."error_logs" enable row level security;

-- Create primary key
CREATE UNIQUE INDEX IF NOT EXISTS error_logs_pkey ON public.error_logs USING btree (id);

-- Add primary key constraint safely
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'error_logs_pkey' 
        AND conrelid = 'public.error_logs'::regclass
    ) THEN
        ALTER TABLE "public"."error_logs" ADD CONSTRAINT "error_logs_pkey" PRIMARY KEY USING INDEX "error_logs_pkey";
    END IF;
END $$;

-- Grant permissions to service_role for server-side operations
grant delete on table "public"."error_logs" to "service_role";
grant insert on table "public"."error_logs" to "service_role";
grant references on table "public"."error_logs" to "service_role";
grant select on table "public"."error_logs" to "service_role";
grant trigger on table "public"."error_logs" to "service_role";
grant truncate on table "public"."error_logs" to "service_role";
grant update on table "public"."error_logs" to "service_role";

-- Grant read permissions to authenticated users (for dashboards)
grant select on table "public"."error_logs" to "authenticated";

-- Add foreign key constraints
ALTER TABLE "public"."error_logs" ADD CONSTRAINT "error_logs_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE;
ALTER TABLE "public"."error_logs" ADD CONSTRAINT "error_logs_room_id_fkey" FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE;

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS error_logs_created_at_idx ON public.error_logs USING btree (created_at);
CREATE INDEX IF NOT EXISTS error_logs_account_id_idx ON public.error_logs USING btree (account_id);
CREATE INDEX IF NOT EXISTS error_logs_error_type_idx ON public.error_logs USING btree (error_type);
CREATE INDEX IF NOT EXISTS error_logs_tool_name_idx ON public.error_logs USING btree (tool_name);

-- Comments for documentation
COMMENT ON TABLE "public"."error_logs" IS 'Stores structured error logs from chat API for monitoring and analysis';
COMMENT ON COLUMN "public"."error_logs"."raw_message" IS 'Original error message text';
COMMENT ON COLUMN "public"."error_logs"."telegram_message_id" IS 'Unique ID for deduplication, typically timestamp';
COMMENT ON COLUMN "public"."error_logs"."account_id" IS 'Account ID of user who triggered the error (foreign key to accounts table)';
COMMENT ON COLUMN "public"."error_logs"."room_id" IS 'Chat room/conversation ID where error occurred (foreign key to rooms table)';
COMMENT ON COLUMN "public"."error_logs"."error_timestamp" IS 'When the error occurred (may differ from created_at)';
COMMENT ON COLUMN "public"."error_logs"."error_message" IS 'Structured error message';
COMMENT ON COLUMN "public"."error_logs"."error_type" IS 'Type of error (AI_RetryError, ValidationError, etc.)';
COMMENT ON COLUMN "public"."error_logs"."tool_name" IS 'Tool that caused error (rate_limit, search_web, contact_team, etc.)';
COMMENT ON COLUMN "public"."error_logs"."last_message" IS 'Last user message for context';
COMMENT ON COLUMN "public"."error_logs"."stack_trace" IS 'Full error stack trace for debugging'; 