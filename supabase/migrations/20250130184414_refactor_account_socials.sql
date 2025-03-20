alter table "public"."account_socials" drop column "avatar";

alter table "public"."account_socials" drop column "bio";

alter table "public"."account_socials" drop column "followerCount";

alter table "public"."account_socials" drop column "followingCount";

alter table "public"."account_socials" drop column "link";

alter table "public"."account_socials" drop column "region";

alter table "public"."account_socials" drop column "type";

alter table "public"."account_socials" drop column "username";

alter table "public"."account_socials" add constraint "account_socials_social_id_fkey" FOREIGN KEY (social_id) REFERENCES socials(id) ON DELETE CASCADE not valid;

alter table "public"."account_socials" validate constraint "account_socials_social_id_fkey";


