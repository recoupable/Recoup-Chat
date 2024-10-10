import getFandata from "./getFandata";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

const getFans = async (client: SupabaseClient<Database, "public">) => {
  const { data: fans } = await client.from("fans").select("*");

  if (!fans?.length || !fans[0]) return "";

  const columns = Object.keys(fans[0]);
  const rows = fans.map((fan) => {
    const data = getFandata(fan);
    return Object.values(data);
  });

  const fanContext = `\n\n1. Fans for the latest campaign in the format (${columns.join(
    ", ",
  )}):\n\t
    ${rows.join("\n\t")}`;

  return fanContext;
};

export default getFans;
