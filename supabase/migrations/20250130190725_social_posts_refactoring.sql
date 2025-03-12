alter table "public"."social_posts" drop constraint "social_posts_account_social_id_fkey";

alter table "public"."social_posts" drop column "account_social_id";

alter table "public"."social_posts" add column "social_id" uuid default gen_random_uuid();

alter table "public"."social_posts" add constraint "social_posts_social_id_fkey" FOREIGN KEY (social_id) REFERENCES socials(id) ON DELETE CASCADE not valid;

alter table "public"."social_posts" validate constraint "social_posts_social_id_fkey";


