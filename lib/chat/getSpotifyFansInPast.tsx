import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

const getSpotifyFansInPast = async (
  client: SupabaseClient<Database, "public">,
  duration: number,
) => {
  const currentEpochTime = Date.now();
  const { data } = await client
    .from("spotify")
    .select("display_name, country, game, timestamp")
    .gt("timestamp", currentEpochTime - duration)
    .lt("timestamp", currentEpochTime);

  if (!data) return [];
  return data;
};

export default getSpotifyFansInPast;
