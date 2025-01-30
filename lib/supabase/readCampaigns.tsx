import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import { validate } from "uuid";

type Campaign = {
  id: string;
};

/**
 * Reads campaigns for a given email and optional artist ID
 * @param email The email to get campaigns for
 * @param artistId Optional artist ID to filter campaigns
 * @returns Array of campaigns
 */
const readCampaigns = async (
  email: string,
  artistId?: string
): Promise<Campaign[]> => {
  try {
    const client = getSupabaseServerAdminClient();

    // Validate artistId if provided, otherwise use empty string
    const queryId = artistId && validate(artistId) ? artistId : "";

    const { data } = await client.rpc("get_campaign_fans", {
      artistid: queryId,
      email,
    });

    // Validate response structure
    if (
      !data ||
      typeof data !== "object" ||
      !Array.isArray((data as { campaigns: Campaign[] }).campaigns)
    ) {
      return [];
    }

    return (data as { campaigns: Campaign[] }).campaigns;
  } catch (error) {
    console.error("Error in readCampaigns:", error);
    return [];
  }
};

export default readCampaigns;
