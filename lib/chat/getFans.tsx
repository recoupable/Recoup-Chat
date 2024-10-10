import getFandata from "./getFandata";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

const getFans = async (client: SupabaseClient<Database, "public">) => {
  const { data: fans } = await client.from("fans").select("*");

  if (!fans?.length) return "No fans.";

  const rows = fans.map((fan) => {
    const data = getFandata(fan);
    return Object.values(data);
  });

  return rows.join("\n\t");
};

export default getFans;
