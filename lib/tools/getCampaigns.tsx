import { z } from "zod";
import { tool } from "ai";
import { ArtistToolResponse } from "@/types/Tool";
import readCampaigns from "../supabase/readCampaigns";

const getCampaigns = (question: string, email: string, artistId: string) =>
  tool({
    description: `IMPORTANT: Always call this tool for ANY question related to the campaigns I manage or have:
    Do NOT attempt to answer questions on these topics without calling this tool first.

    Example questions that MUST trigger this tool:
    - "What campaigns do I have?"
    - "What campaigns do I manage?"
    - "My campaigns???"
    - "Let me know my campaigns."`,
    parameters: z.object({
      artist_id: z.string().optional().describe("Artist id of campagins"),
    }),
    execute: async ({ artist_id }) => {
      const campaigns = await readCampaigns(email, artistId || artist_id);
      return {
        context: {
          status: campaigns.length
            ? ArtistToolResponse.CAMPAIGN_LIST
            : ArtistToolResponse.NO_CAMPAIGNS,
          campaigns,
        },
        question,
      };
    },
  });

export default getCampaigns;
