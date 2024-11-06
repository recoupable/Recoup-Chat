import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";
import { CampaignRecord } from "@/types/Artist";

const getStreamsCount = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: SupabaseClient<Database, "public", any>,
  email: string,
  artistId: string,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let clientIds = [] as any;

  if (artistId) {
    const { data } = await client
      .from("campaigns")
      .select("*")
      .eq("artistId", artistId);
    if (data?.length) clientIds.push(data[0].clientId);
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
      clientIds = campaigns?.map(
        (campaign: CampaignRecord) => campaign.clientId,
      );
    }
  }

  const { count: spotifyCount } = await client
    .from("spotify_play_button_clicked")
    .select("*", { count: "exact" })
    .in("clientId", clientIds);
  const { count: appleCount } = await client
    .from("apple_play_button_clicked")
    .select("*", { count: "exact" })
    .in("clientId", clientIds);

  return (spotifyCount || 0) + (appleCount || 0);
};

export default getStreamsCount;
