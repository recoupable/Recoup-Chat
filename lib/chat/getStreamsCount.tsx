import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

const getStreamsCount = async (client: SupabaseClient<Database, "public">) => {
  const { data } = await client.from("fans").select("clientId, count()");

  return data?.length || 0;
};

export default getStreamsCount;
