import { z } from "zod";
import { tool } from "ai";
import { ArtistToolResponse } from "@/types/Tool";

const analyzeArtist = (question: string) =>
  tool({
    description: `Please only trigger this tool for questions in the example format below.
    Questions must begin with the word **Analyze** to trigger this tool.

    Example questions that MUST trigger this tool:
    - "Analyze [handles]'s [platform] posts from this week."
    - "Analyze my musician."
    - "Analyze my artists' [platform] account."
    - "Analyze [handle]."`,
    parameters: z.object({
      handle: z.string().describe("The handle to be analyzed."),
      platform: z.string().describe("The platform to be analyzed."),
    }),
    execute: async ({ handle, platform }) => {
      return {
        context: {
          args: {
            handle,
            platform,
          },
          status: ArtistToolResponse.ANALYZE_ARTIST,
        },
        question,
      };
    },
  });

export default analyzeArtist;
