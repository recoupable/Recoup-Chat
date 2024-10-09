import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

const getMostPlayed = async (client: SupabaseClient<Database, "public">) => {
  const { data } = await client
    .from("spotify_play_button_clicked")
    .select("fanId, count()");
  // .order("played_count", { ascending: false })
  // .single();

  if (!data) return "";
  const fanId = data[0].fanId;

  const { data: fan } = await client
    .from("fans")
    .select("*")
    .eq("id", fanId)
    .single();

  return fan?.display_name;
};

export default getMostPlayed;
