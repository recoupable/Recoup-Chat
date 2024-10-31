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
    Extract Parameters from the Current Prompt: Always derive parameters from the current question only. Do not reference parameters from previous questions or responses.
    Immediate Parameter Extraction:
    Avoid Parameter Duplication: Ensure that the parameters used to create a campaign in response to each request are fresh and specific to that request. Parameters defined in previous interactions must not influence current operations.

    Must Trigger the Tool:
    "Create a new campaign."
    "I want to create a new campaign."
    Do Not Use Previous Context: Each of the above questions must be treated as entirely new requests, with a unique set of parameters extracted from the current input.`,
    parameters: z.object({
      campaign_name: z
        .string()
        .optional()
        .describe("The campaign name to be created."),
      artist_id: z
        .string()
        .optional()
        .describe("The artist id of the campaign to be created."),
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
