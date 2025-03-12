ALTER TABLE "public"."tiktok_analysis"  ADD COLUMN if not exists "bio" TEXT;
ALTER TABLE "public"."tiktok_analysis"  ADD COLUMN if not exists "region" TEXT;
ALTER TABLE "public"."tiktok_analysis"  ADD COLUMN if not exists "fans" integer;
ALTER TABLE "public"."tiktok_analysis"  ADD COLUMN if not exists "following" integer;
