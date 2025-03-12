ALTER TABLE "public"."tiktok_analysis"  DROP COLUMN IF EXISTS "timestamp";
ALTER TABLE "public"."tiktok_analysis"  ADD COLUMN IF NOT EXISTS "timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;