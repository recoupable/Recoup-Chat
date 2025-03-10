create table "public"."agent_status" (
    "id" uuid not null default gen_random_uuid(),
    "agent_id" uuid not null default gen_random_uuid(),
    "social_platform" text,
    "status" bigint default '0'::bigint,
    "progress" bigint default '0'::bigint,
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."agent_status" enable row level security;

create table "public"."agents" (
    "id" uuid not null default gen_random_uuid(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."agents" enable row level security;

CREATE UNIQUE INDEX agent_status_pkey ON public.agent_status USING btree (id);

CREATE UNIQUE INDEX agents_pkey ON public.agents USING btree (id);

alter table "public"."agent_status" add constraint "agent_status_pkey" PRIMARY KEY using index "agent_status_pkey";

alter table "public"."agents" add constraint "agents_pkey" PRIMARY KEY using index "agents_pkey";

alter table "public"."agent_status" add constraint "agent_status_agent_id_fkey" FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE not valid;

alter table "public"."agent_status" validate constraint "agent_status_agent_id_fkey";

grant delete on table "public"."agent_status" to "anon";

grant insert on table "public"."agent_status" to "anon";

grant references on table "public"."agent_status" to "anon";

grant select on table "public"."agent_status" to "anon";

grant trigger on table "public"."agent_status" to "anon";

grant truncate on table "public"."agent_status" to "anon";

grant update on table "public"."agent_status" to "anon";

grant delete on table "public"."agent_status" to "authenticated";

grant insert on table "public"."agent_status" to "authenticated";

grant references on table "public"."agent_status" to "authenticated";

grant select on table "public"."agent_status" to "authenticated";

grant trigger on table "public"."agent_status" to "authenticated";

grant truncate on table "public"."agent_status" to "authenticated";

grant update on table "public"."agent_status" to "authenticated";

grant delete on table "public"."agent_status" to "service_role";

grant insert on table "public"."agent_status" to "service_role";

grant references on table "public"."agent_status" to "service_role";

grant select on table "public"."agent_status" to "service_role";

grant trigger on table "public"."agent_status" to "service_role";

grant truncate on table "public"."agent_status" to "service_role";

grant update on table "public"."agent_status" to "service_role";

grant delete on table "public"."agents" to "anon";

grant insert on table "public"."agents" to "anon";

grant references on table "public"."agents" to "anon";

grant select on table "public"."agents" to "anon";

grant trigger on table "public"."agents" to "anon";

grant truncate on table "public"."agents" to "anon";

grant update on table "public"."agents" to "anon";

grant delete on table "public"."agents" to "authenticated";

grant insert on table "public"."agents" to "authenticated";

grant references on table "public"."agents" to "authenticated";

grant select on table "public"."agents" to "authenticated";

grant trigger on table "public"."agents" to "authenticated";

grant truncate on table "public"."agents" to "authenticated";

grant update on table "public"."agents" to "authenticated";

grant delete on table "public"."agents" to "service_role";

grant insert on table "public"."agents" to "service_role";

grant references on table "public"."agents" to "service_role";

grant select on table "public"."agents" to "service_role";

grant trigger on table "public"."agents" to "service_role";

grant truncate on table "public"."agents" to "service_role";

grant update on table "public"."agents" to "service_role";

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON agents
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at(); 

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON agent_status
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at(); 


