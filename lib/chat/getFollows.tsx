import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

const getFollows = async (client: SupabaseClient<Database, "public">) => {
  const { count } = await client
    .from("follows")
    .select("*", { count: "exact" });

  return count;
};

export default getFollows;
