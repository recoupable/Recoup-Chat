import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

const getTopScore = async (client: SupabaseClient<Database, "public">) => {
  const { data } = await client
    .from("leaderboard")
    .select("*")
    .order("Score", { ascending: false })
    .single();

  return data;
};

export default getTopScore;
