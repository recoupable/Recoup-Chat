import { z } from "zod";
import { tool } from "ai";
import getTiktokTrends from "../apify/getTiktokTrends";
import { ArtistToolResponse } from "@/types/Tool";
import getTikTokContext from "../apify/getTikTokContext";

const getArtistAnaysis = (question: string) =>
  tool({
    description: `IMPORTANT: Always call this tool for ANY question related to to artist analytics:
    Do NOT attempt to answer questions on these topics without calling this tool first.

    Example questions that MUST trigger this tool:
    - "What’s the artist's latest activity on social media?"
    - "How did the artist become famous?"`,
    parameters: z.object({
      user_name: z
        .string()
        .optional()
        .describe("The TikTok username of the artist to be analyzed."),
    }),
    execute: async ({ user_name }) => {
      if (!user_name)
        return {
          context: {
            status: ArtistToolResponse.MISSING_ARTIST_TIKTOK_USERNAME,
            answer: "Please provide the TikTok username to proceed.",
          },
          question,
        };
      const trends = await getTiktokTrends();
      const artistTrends = trends.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (trend: any) => trend.author.unique_id === user_name,
      );
      const trendsContext = getTikTokContext(artistTrends);

      return {
        context: {
          trends: trendsContext,
        },
        question,
      };
    },
  });

export default getArtistAnaysis;
