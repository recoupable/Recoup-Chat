create table "public"."account_info" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "image" text,
    "knowledges" jsonb default '[]'::jsonb,
    "label" text,
    "instruction" text,
    "organization" text,
    "account_id" uuid default gen_random_uuid()
);


alter table "public"."account_info" enable row level security;

CREATE UNIQUE INDEX account_info_pkey ON public.account_info USING btree (id);

alter table "public"."account_info" add constraint "account_info_pkey" PRIMARY KEY using index "account_info_pkey";

alter table "public"."account_info" add constraint "account_info_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE not valid;

alter table "public"."account_info" validate constraint "account_info_account_id_fkey";

grant delete on table "public"."account_info" to "anon";

grant insert on table "public"."account_info" to "anon";

grant references on table "public"."account_info" to "anon";

grant select on table "public"."account_info" to "anon";

grant trigger on table "public"."account_info" to "anon";

grant truncate on table "public"."account_info" to "anon";

grant update on table "public"."account_info" to "anon";

grant delete on table "public"."account_info" to "authenticated";

grant insert on table "public"."account_info" to "authenticated";

grant references on table "public"."account_info" to "authenticated";

grant select on table "public"."account_info" to "authenticated";

grant trigger on table "public"."account_info" to "authenticated";

grant truncate on table "public"."account_info" to "authenticated";

grant update on table "public"."account_info" to "authenticated";

grant delete on table "public"."account_info" to "service_role";

grant insert on table "public"."account_info" to "service_role";

grant references on table "public"."account_info" to "service_role";

grant select on table "public"."account_info" to "service_role";

grant trigger on table "public"."account_info" to "service_role";

grant truncate on table "public"."account_info" to "service_role";

grant update on table "public"."account_info" to "service_role";


