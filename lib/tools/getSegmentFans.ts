import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { getSegmentFans } from "../supabase/getSegmentFans";

export const getSegmentFansTool = tool(
  async (_input: Record<string, never>, runnable) => {
    const segmentId = runnable.configurable?.segmentId;
    if (!segmentId) {
      const error = "No segment ID provided in context";
      console.error("[SegmentFansTool] Error:", error);
      return JSON.stringify({
        fans: [],
        error,
      });
    }

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
  {
    name: "get_segment_fans",
    description: "Get all fans belonging to the current segment",
    schema: z.object({}),
  }
);
