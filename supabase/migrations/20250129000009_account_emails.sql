create table "public"."account_emails" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "account_id" uuid default gen_random_uuid(),
    "email" text
);


alter table "public"."account_emails" enable row level security;

CREATE UNIQUE INDEX account_emails_pkey ON public.account_emails USING btree (id);

alter table "public"."account_emails" add constraint "account_emails_pkey" PRIMARY KEY using index "account_emails_pkey";

alter table "public"."account_emails" add constraint "account_emails_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE not valid;

alter table "public"."account_emails" validate constraint "account_emails_account_id_fkey";

grant delete on table "public"."account_emails" to "anon";

grant insert on table "public"."account_emails" to "anon";

grant references on table "public"."account_emails" to "anon";

grant select on table "public"."account_emails" to "anon";

grant trigger on table "public"."account_emails" to "anon";

grant truncate on table "public"."account_emails" to "anon";

grant update on table "public"."account_emails" to "anon";

grant delete on table "public"."account_emails" to "authenticated";

grant insert on table "public"."account_emails" to "authenticated";

grant references on table "public"."account_emails" to "authenticated";

grant select on table "public"."account_emails" to "authenticated";

grant trigger on table "public"."account_emails" to "authenticated";

grant truncate on table "public"."account_emails" to "authenticated";

grant update on table "public"."account_emails" to "authenticated";

grant delete on table "public"."account_emails" to "service_role";

grant insert on table "public"."account_emails" to "service_role";

grant references on table "public"."account_emails" to "service_role";

grant select on table "public"."account_emails" to "service_role";

grant trigger on table "public"."account_emails" to "service_role";

grant truncate on table "public"."account_emails" to "service_role";

grant update on table "public"."account_emails" to "service_role";


