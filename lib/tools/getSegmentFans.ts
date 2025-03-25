import { Tool } from "ai";
import { z } from "zod";
import { getSegmentFans } from "../supabase/getSegmentFans";

const getSegmentFansTool = (segmentId: string): Tool => ({
  description: "Get all fans belonging to the current segment",
  parameters: z.object({}),
  execute: async () => {
    try {
      const fans = await getSegmentFans(segmentId);
      const response = JSON.stringify({ fans, error: null });
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("[SegmentFansTool] Error:", {
        error: errorMessage,
        segmentId,
      });
      return JSON.stringify({
        fans: [],
        error: errorMessage,
      });
    }
  },
});

export default getSegmentFansTool;
