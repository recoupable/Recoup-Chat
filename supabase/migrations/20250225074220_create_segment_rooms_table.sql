-- Create segment_rooms table to establish relationship between segments and rooms
CREATE TABLE IF NOT EXISTS "public"."segment_rooms" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "segment_id" UUID NOT NULL,
    "room_id" UUID NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Enable row level security
ALTER TABLE "public"."segment_rooms" ENABLE ROW LEVEL SECURITY;

-- Create primary key
CREATE UNIQUE INDEX segment_rooms_pkey ON public.segment_rooms USING btree (id);
ALTER TABLE "public"."segment_rooms" ADD CONSTRAINT "segment_rooms_pkey" PRIMARY KEY USING INDEX "segment_rooms_pkey";

-- Add foreign key constraints
ALTER TABLE "public"."segment_rooms" ADD CONSTRAINT "segment_rooms_segment_id_fkey" 
    FOREIGN KEY (segment_id) REFERENCES segments(id) ON DELETE CASCADE NOT VALID;
ALTER TABLE "public"."segment_rooms" VALIDATE CONSTRAINT "segment_rooms_segment_id_fkey";

ALTER TABLE "public"."segment_rooms" ADD CONSTRAINT "segment_rooms_room_id_fkey" 
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE NOT VALID;
ALTER TABLE "public"."segment_rooms" VALIDATE CONSTRAINT "segment_rooms_room_id_fkey";

-- Grant permissions
GRANT DELETE ON TABLE "public"."segment_rooms" TO "anon";
GRANT INSERT ON TABLE "public"."segment_rooms" TO "anon";
GRANT REFERENCES ON TABLE "public"."segment_rooms" TO "anon";
GRANT SELECT ON TABLE "public"."segment_rooms" TO "anon";
GRANT TRIGGER ON TABLE "public"."segment_rooms" TO "anon";
GRANT TRUNCATE ON TABLE "public"."segment_rooms" TO "anon";
GRANT UPDATE ON TABLE "public"."segment_rooms" TO "anon";

GRANT DELETE ON TABLE "public"."segment_rooms" TO "authenticated";
GRANT INSERT ON TABLE "public"."segment_rooms" TO "authenticated";
GRANT REFERENCES ON TABLE "public"."segment_rooms" TO "authenticated";
GRANT SELECT ON TABLE "public"."segment_rooms" TO "authenticated";
GRANT TRIGGER ON TABLE "public"."segment_rooms" TO "authenticated";
GRANT TRUNCATE ON TABLE "public"."segment_rooms" TO "authenticated";
GRANT UPDATE ON TABLE "public"."segment_rooms" TO "authenticated";

GRANT DELETE ON TABLE "public"."segment_rooms" TO "service_role";
GRANT INSERT ON TABLE "public"."segment_rooms" TO "service_role";
GRANT REFERENCES ON TABLE "public"."segment_rooms" TO "service_role";
GRANT SELECT ON TABLE "public"."segment_rooms" TO "service_role";
GRANT TRIGGER ON TABLE "public"."segment_rooms" TO "service_role";
GRANT TRUNCATE ON TABLE "public"."segment_rooms" TO "service_role";
GRANT UPDATE ON TABLE "public"."segment_rooms" TO "service_role";

-- Add trigger for updating updated_at timestamp
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON segment_rooms
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();

-- DOWN migration
-- DROP TRIGGER IF EXISTS set_updated_at ON segment_rooms;
-- DROP TABLE IF EXISTS "public"."segment_rooms"; 