alter table "public"."tiktok_analysis" add column "artistId" uuid default '00000000-0000-0000-0000-000000000000'::uuid;

alter table "public"."tiktok_analysis" add constraint "tiktok_analysis_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES artists(id) ON UPDATE CASCADE not valid;

alter table "public"."tiktok_analysis" validate constraint "tiktok_analysis_artistId_fkey";

UPDATE "public"."tiktok_analysis" SET "artistId" = 'eb260f72-81b1-4638-8c9b-3b61f6b779b7' WHERE "name" = 'breland';
UPDATE "public"."tiktok_analysis" SET "artistId" = 'd325c37f-558b-4015-8863-340e4d8c6ec5' WHERE "name" = 'officialluhtyler';
UPDATE "public"."tiktok_analysis" SET "artistId" = '50baf49a-55f8-4848-8882-caedc4d67d0f' WHERE "name" = 'sweetman.eth';



