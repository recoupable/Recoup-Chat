import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

const getStreamsCount = async (client: SupabaseClient<Database, "public">) => {
  const { count: spotifyCount } = await client
    .from("spotify_play_button_clicked")
    .select("*", { count: "exact" });
  const { count: appleCount } = await client
    .from("apple_play_button_clicked")
    .select("*", { count: "exact" });

  return (spotifyCount || 0) + (appleCount || 0);
};

export default getStreamsCount;
