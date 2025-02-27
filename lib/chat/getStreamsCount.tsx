import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { CampaignRecord } from "@/types/Artist";

const getStreamsCount = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: SupabaseClient<Database, "public", any>,
  artistId: string,
  email: string
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let campaignIds = [] as any;

  if (artistId) {
    const { data } = await client
      .from("campaigns")
      .select("id")
      .eq("artistId", artistId);
    if (data?.length) campaignIds = data.map((item) => item.id);
  } else {
    const { data } = await client
      .from("accounts")
      .select("*")
      .eq("email", email);
    if (data?.length) {
      const artistIds = data[0].artistIds;
      const { data: campaigns } = await client
        .from("campaigns")
        .select("*")
        .in("artistId", artistIds);
      campaignIds = campaigns?.map((campaign: CampaignRecord) => campaign.id);
    }
  }

  const { count: spotifyCount } = await client
    .from("spotify_play_button_clicked")
    .select("*", { count: "exact" })
    .in("campaignId", campaignIds);
  const { count: appleCount } = await client
    .from("apple_play_button_clicked")
    .select("*", { count: "exact" })
    .in("campaignId", campaignIds);

  const total_count = (spotifyCount || 0) + (appleCount || 0);
  return {
    total_count,
    average_count: parseInt(Number(total_count / 2).toFixed(0), 10),
  };
};

export default getStreamsCount;
