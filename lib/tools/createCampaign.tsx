import { z } from "zod";
import { tool } from "ai";
import { ArtistToolResponse } from "@/types/Tool";
import upsertCampaign from "../supabase/upsertCampaign";
import readArtists from "../supabase/readArtists";

const createCampaign = (question: string, email: string) =>
  tool({
    description: `
    IMPORTANT: Always call this tool for ANY question related to creating a campaign.
    NOTE: This feature must always execute when prompted to create a campaign, regardless of whether you receive an artist ID or campaign name.

    The following is list that trigger this function and whether parameter values are defined or not.
    "Create a new campaign." -> ALWAYS [undefined].
    "I want to create a new campaign." -> ALWAYS [undefined].
    "Create a campaign." -> ALWAYS [undefined]
    "Create a new campaign. CampaignName: [campaign name] ArtistId: [artistId]" -> [defined]`,
    parameters: z.object({
      campaign_name: z
        .string()
        .optional()
        .describe("The campaign name to be created."),
      artist_id: z.string().optional().describe("The artist id to be created."),
    }),
    execute: async ({ campaign_name, artist_id }) => {
      if (!artist_id || !campaign_name) {
        const artists = await readArtists(email);
        return {
          context: {
            status: ArtistToolResponse.MISSING_ARTIST_CLIENT_ID,
            answer: "Please provide the artist id & campaign name to proceed.",
            artists,
          },
          question,
        };
      }

      const data = await upsertCampaign(artist_id, campaign_name);
      return {
        context: {
          status: ArtistToolResponse.CREATED_CAMPAIGN,
          data: data,
        },
        question,
      };
    },
  });

export default createCampaign;
