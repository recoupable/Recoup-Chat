import { z } from "zod";
import getFans from "../chat/getFans";
import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import { tool } from "ai";

const getCampaign = (question: string) =>
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
    parameters: z.object({}),
    execute: async () => {
      const client = getSupabaseServerAdminClient();
      const fans = await getFans(client);
      return {
        context: fans,
        question,
      };
    },
  });

export default getCampaign;
