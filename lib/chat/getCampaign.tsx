import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";
import getFollows from "./getFollows";
import limitCollections from "../limitCollections";
import { FAN_TYPE } from "@/types/fans";

const getCampaign = async (client: SupabaseClient<Database, "public">) => {
  const { data: campaignInfo } = (await client.rpc("get_campaign", {
    clientid: "",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  })) as any;

  if (!campaignInfo) return;
  const fans = campaignInfo?.fans;

  const premiumCount = (fans as unknown as FAN_TYPE[]).filter(
    (fan) => fan.product === "premium",
  ).length;

  const freeCount = (fans as unknown as FAN_TYPE[]).filter(
    (fan) => fan.product === "free",
  ).length;
  const followers = await getFollows(client);

  return {
    playlist: limitCollections(campaignInfo.playlist),
    artists: limitCollections(campaignInfo.artists),
    episodes: limitCollections(campaignInfo.episodes),
    albums: limitCollections(campaignInfo.albums),
    tracks: limitCollections(campaignInfo.tracks),
    shows: limitCollections(campaignInfo.shows),
    audioBooks: limitCollections(campaignInfo.audio_books),
    premiumCount,
    freeCount,
    followers,
    totalFansCount: premiumCount + freeCount,
    fans,
  };
};

export default getCampaign;
