drop trigger if exists "add_current_user_to_new_account" on "public"."accounts";

drop trigger if exists "on_account_created_fill_credits" on "public"."accounts";

drop trigger if exists "protect_account_fields" on "public"."accounts";

drop trigger if exists "set_slug_from_account_name" on "public"."accounts";

drop trigger if exists "update_slug_from_account_name" on "public"."accounts";

drop policy "accounts_read" on "public"."accounts";

drop policy "accounts_self_update" on "public"."accounts";

drop policy "create_org_account" on "public"."accounts";

alter table "public"."accounts" drop constraint "accounts_created_by_fkey";

alter table "public"."accounts" drop constraint "accounts_email_key";

alter table "public"."accounts" drop constraint "accounts_primary_owner_user_id_fkey";

alter table "public"."accounts" drop constraint "accounts_slug_key";

alter table "public"."accounts" drop constraint "accounts_slug_null_if_personal_account_true";

alter table "public"."accounts" drop constraint "accounts_updated_by_fkey";

alter table "public"."accounts_memberships" drop constraint "accounts_memberships_account_id_fkey";

alter table "public"."billing_customers" drop constraint "billing_customers_account_id_fkey";

alter table "public"."chat_messages" drop constraint "chat_messages_account_id_fkey";

alter table "public"."chats" drop constraint "chats_account_id_fkey";

alter table "public"."credits_usage" drop constraint "credits_usage_account_id_fkey";

alter table "public"."invitations" drop constraint "invitations_account_id_fkey";

alter table "public"."notifications" drop constraint "notifications_account_id_fkey";

alter table "public"."orders" drop constraint "orders_account_id_fkey";

alter table "public"."subscriptions" drop constraint "subscriptions_account_id_fkey";

alter table "public"."tasks" drop constraint "tasks_account_id_fkey";

drop function if exists "public"."create_team_account"(account_name text);

drop view if exists "public"."user_account_workspace";

drop view if exists "public"."user_accounts";

drop index if exists "public"."accounts_email_key";

drop index if exists "public"."accounts_slug_key";

drop index if exists "public"."ix_accounts_is_personal_account";

drop index if exists "public"."ix_accounts_primary_owner_user_id";

drop index if exists "public"."unique_personal_account";

alter table "public"."accounts" drop column "created_at";

alter table "public"."accounts" drop column "created_by";

alter table "public"."accounts" drop column "is_personal_account";

alter table "public"."accounts" drop column "name";

alter table "public"."accounts" drop column "picture_url";

alter table "public"."accounts" drop column "primary_owner_user_id";

alter table "public"."accounts" drop column "public_data";

alter table "public"."accounts" drop column "slug";

alter table "public"."accounts" drop column "updated_at";

alter table "public"."accounts" drop column "updated_by";

alter table "public"."accounts" add column "artistIds" jsonb;

alter table "public"."accounts" add column "timestamp" bigint;

alter table "public"."accounts" alter column "email" set data type text using "email"::text;

alter table "public"."accounts" alter column "id" set default gen_random_uuid();


