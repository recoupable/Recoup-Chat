import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import { validate } from "uuid";

const readCampaigns = async (email: string, artistId?: string) => {
  try {
    const client = getSupabaseServerAdminClient();
    let queryId = artistId;
    if (!validate(artistId || "")) queryId = "";
    const { data } = await client.rpc("get_campaign_fans", {
      artistid: queryId,
      email,
    });

    return data?.campaigns;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default readCampaigns;
