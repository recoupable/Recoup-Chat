import { Database } from "@/types/database.types";
import { PostgrestError } from "@supabase/supabase-js";
import supabase from "./serverClient";

type Social = Database["public"]["Tables"]["socials"]["Row"];
type FanSegmentWithSocial = {
  socials: Social;
};

export async function getSegmentFans(segmentId: string): Promise<Social[]> {
  try {
    const { data: fans, error } = (await supabase
      .from("fan_segments")
      .select(
        `
        socials:fan_social_id (
          *
        )
      `
      )
      .eq("segment_id", segmentId)) as {
      data: FanSegmentWithSocial[] | null;
      error: PostgrestError | null;
    };

    if (error) {
      console.error("[getSegmentFans] Database error:", {
        error: error.message,
        code: error.code,
        details: error.details,
        segmentId,
      });
      return [];
    }

    const results = (fans || []).map((fan) => fan.socials);
    return results;
  } catch (error) {
    console.error("[getSegmentFans] Unexpected error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      segmentId,
    });
    return [];
  }
}
