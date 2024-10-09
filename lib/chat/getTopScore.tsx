import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

const getTopScore = async (client: SupabaseClient<Database, "public">) => {
  const { data } = await client
    .from("leaderboard")
    .select("*")
    .order("Score", { ascending: false });

  if (!data) return "";

  return data[0].Name;
};

export default getTopScore;
