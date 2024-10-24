import { tool } from "ai";
import { z } from "zod";
import getCampaign from "../chat/getCampaign";
import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";

const campaignTool = (question: string) =>
  tool({
    description: `IMPORTANT: Always call this tool for ANY question related to the following topics:
    1. Artists
    2. Albums
    3. Episodes
    4. Tracks
    5. Audio books
    6. Shows
    7. Fans (including premium, free, or total counts)
    8. Listening habits (from any platform, including Spotify and Apple)
    9. Campaign insights or data
    10. Any comparison or analysis of music consumption or fan behavior

    Do NOT attempt to answer questions on these topics without calling this tool first.

    Example questions that MUST trigger this tool:
    - "What are the listening habits from Spotify and Apple?"
    - "How many fans does the artist have?"
    - "What insights can we draw from the latest campaign?"
    - "How many premium subscribers are there?"

    When in doubt, call this tool to ensure you have the most up-to-date and accurate information.`,
    parameters: z.object({
      specific_focus: z
        .enum([
          "listening_habits",
          "artists",
          "tracks",
          "episodes",
          "audio_books",
          "shows",
          "playlist",
          "albums",
        ])
        .describe("Focus on either listening habits, artists, or tracks."),
    }),
    execute: async ({ specific_focus }) => {
      const client = getSupabaseServerAdminClient();
      const fans = await getCampaign(client);
      return {
        context: fans,
        question,
        specificFocus: specific_focus,
      };
    },
  });

export default campaignTool;
