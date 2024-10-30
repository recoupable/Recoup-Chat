import { z } from "zod";
import { tool } from "ai";
import getTiktokTrends from "../apify/getTiktokTrends";
import { ArtistToolResponse } from "@/types/Tool";

const getArtistAnaysis = (question: string) =>
  tool({
    description: `IMPORTANT: Always call this tool for ANY question related to to artist analytics:
    Do NOT attempt to answer questions on these topics without calling this tool first.

    Example questions that MUST trigger this tool:
    - "What’s the artist's latest activity on social media?"
    - "How did the artist become famous?"`,
    parameters: z.object({
      artist_name: z
        .string()
        .optional()
        .describe("The name of the artist to be analyzed."),
    }),
    execute: async ({ artist_name }) => {
      if (!artist_name)
        return {
          context: {
            status: ArtistToolResponse.MISSING_ARTIST_NAME,
            answer: "Please provide the artist name to proceed.",
          },
          question,
        };
      const trends = await getTiktokTrends();
      return {
        context: {
          trends,
          artist_name: artist_name || "not provided",
        },
        question,
      };
    },
  });

export default getArtistAnaysis;
