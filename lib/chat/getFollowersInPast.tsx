import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

const getFollowersInPast = async (
  client: SupabaseClient<Database, "public">,
  duration: number,
) => {
  const currentEpochTime = Date.now();
  const { count } = await client
    .from("follows")
    .select("*", { count: "exact" })
    .gt("timestamp", currentEpochTime - duration)
    .lt("timestamp", currentEpochTime);

  return count || 0;
};

export default getFollowersInPast;
