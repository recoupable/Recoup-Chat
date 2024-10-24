import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";
import getFollows from "./getFollows";
import limitCollections from "../limitCollections";
import { FAN_TYPE } from "@/types/fans";

const getCampaign = async (client: SupabaseClient<Database, "public">) => {
  const { data: fans } = await client
    .from("fans")
    .select("display_name, country, city, product");

  if (!fans?.length) return "No fans.";
  const { data: campaignInfo } = await client.rpc("get_campaign");

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
