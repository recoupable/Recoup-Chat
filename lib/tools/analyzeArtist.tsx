import { z } from "zod";
import { tool } from "ai";
import { ArtistToolResponse } from "@/types/Tool";

const analyzeArtist = (question: string) =>
  tool({
    description: `Please only trigger this tool for questions in the example format below.
    Questions must begin with the word **Analyze** to trigger this tool.

    Example questions that MUST trigger this tool:
    - "Analyze [handles]'s [social platform] posts from this week."
    - "Analyze my musician."
    - "Analyze my artists' [social platform] account."
    - "Analyze [handle]."`,
    parameters: z.object({
      handle: z.string().optional().describe("The handle to be analyzed."),
      social_platform: z
        .string()
        .optional()
        .describe("The social platform to be analyzed."),
    }),
    execute: async ({ handle, social_platform }) => {
      return {
        context: {
          args: {
            handle: handle || "",
            social_platform: social_platform || "",
          },
          status: ArtistToolResponse.ANALYZE_ARTIST,
        },
        question,
      };
    },
    type: "function",
  });

export default analyzeArtist;
