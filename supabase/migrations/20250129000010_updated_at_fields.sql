alter table "public"."account_emails" drop column "created_at";

alter table "public"."account_emails" add column "updated_at" timestamp with time zone not null default now();

alter table "public"."account_info" drop column "created_at";

alter table "public"."account_info" add column "updated_at" timestamp with time zone not null default now();


CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON account_emails
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamps(); 

CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON account_info
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamps();