import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

const getStartedFans = async (client: SupabaseClient<Database, "public">) => {
  const { count } = await client
    .from("spotify_login_button_clicked")
    .select("*", { count: "exact" });

  return count || 0;
};

export default getStartedFans;
