import { validate } from "uuid";
import supabase from "./serverClient";

const readCampaigns = async (email: string, artistId?: string) => {
  try {
    let queryId = artistId;
    if (!validate(artistId || "")) queryId = "";
    const { data } = await supabase.rpc("get_campaign_fans", {
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
