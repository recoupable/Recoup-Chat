import { z } from "zod";
import { tool } from "ai";
import {
  getSpotifyPlayButtonClicked,
  GetSpotifyPlayButtonClickedResult,
} from "../supabase/getSpotifyPlayButtonClicked";

const getVideoGameCampaignPlays = tool({
  description:
    "Get Spotify play button click events for Tee Grizzley's latest video game campaign.",
  parameters: z.object({}),
  execute: async (): Promise<GetSpotifyPlayButtonClickedResult> => {
    return getSpotifyPlayButtonClicked({
      campaignId: "d3f15e47-4873-45d3-a2be-78f990ca5dcd",
    });
  },
});

export default getVideoGameCampaignPlays;
