CREATE OR REPLACE FUNCTION public.trigger_set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
    new.updated_at = now();
    return NEW;
end
$function$
;

alter table "public"."account_artist_ids" drop column "created_at";

alter table "public"."account_artist_ids" add column "updated_at" timestamp with time zone default now();

alter table "public"."account_emails" drop column "created_at";

alter table "public"."account_info" drop column "created_at";

alter table "public"."funnel_analytics" drop column "created_at";

DROP TRIGGER set_timestamp ON account_emails;
DROP TRIGGER set_timestamp ON account_info;
DROP TRIGGER set_timestamp ON account_phone_numbers;
DROP TRIGGER set_timestamp ON funnel_analytics;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON funnel_analytics
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at(); 

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON account_emails
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at(); 

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON account_artist_ids
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at(); 

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON account_info
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at(); 

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON account_phone_numbers
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at(); 




