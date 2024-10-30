import { z } from "zod";
import { tool } from "ai";
import getTiktokTrends from "../apify/getTiktokTrends";

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
        .describe("The name of the artist to be analyzed."),
    }),
    execute: async ({ artist_name }) => {
      const trends = await getTiktokTrends();
      return {
        context: {
          trends,
          artist_name,
        },
        question,
      };
    },
  });

export default getArtistAnaysis;
