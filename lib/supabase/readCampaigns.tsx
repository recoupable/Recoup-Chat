import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";

const readCampaigns = async (email: string, artistId?: string) => {
  try {
    const client = getSupabaseServerAdminClient();
    const { data } = await client.rpc("get_campaigns_fans", {
      artistid: artistId || "",
      email,
    });

    return data.campaigns;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default readCampaigns;
