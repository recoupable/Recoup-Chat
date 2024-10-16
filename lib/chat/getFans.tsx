import getFandata from "./getFandata";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";
import getFanSegments from "./getFanSegments";

const getFans = async (client: SupabaseClient<Database, "public">) => {
  const { activeFans, casualFans, superFans } = await getFanSegments(client);

  const { data: fans } = await client.from("fans").select("*");

  if (!fans?.length) return "No fans.";

  const rows = fans.map((fan) => {
    const data = getFandata(fan);

    let segment = "Unknown";
    if (casualFans?.includes(data.id)) segment = "Casual Listener";
    if (activeFans?.includes(data.id)) segment = "Active Listener";
    if (superFans?.includes(data.id)) segment = "Super Listener";

    return Object.values({
      ...data,
      segmentType: segment,
    });
  });

  return rows.join("\n\t");
};

export default getFans;
