ALTER TABLE "public"."funnel_analytics" DROP COLUMN IF EXISTS "timestamp";

alter table "public"."funnel_analytics" add column "created_at" timestamp with time zone not null default now();

alter table "public"."funnel_analytics" add column "updated_at" timestamp with time zone not null default now();

alter table "public"."funnel_analytics" DROP COLUMN IF EXISTS "chat_id";

alter table "public"."funnel_analytics" add column "pilot_id" uuid default gen_random_uuid();

CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON funnel_analytics
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamps(); 
