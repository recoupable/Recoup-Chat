import { z } from "zod";
import { tool } from "ai";

// Define the schema for input validation
const schema = z.object({
  segmentName: z.string().describe('Segment name.'),
  fans: z.array(z.string())
    .describe('Array of fan_social_id included in the segment.'),
});

// Define the generateArray tool
const generateArray = tool({
  description: "Generate an array of segments with their associated fan social IDs.",
  parameters: schema,
  execute: async ({ segmentName, fans }) => {
    try {
      return {
        success: true,
        segmentName,
        fans,
        count: fans.length,
      };
    } catch (error) {
      console.error("Error in generateArray tool:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        segmentName: "",
        fans: [],
        count: 0,
      };
    }
  },
});

export default generateArray;
