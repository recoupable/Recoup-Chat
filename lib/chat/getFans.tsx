import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";
import { FAN_TYPE } from "@/types/fans";
import getFollows from "./getFollows";

const getFans = async (client: SupabaseClient<Database, "public">) => {
  const { data: fans } = await client.from("fans").select("*");

  if (!fans?.length) return "No fans.";

  const premiumCount = (fans as unknown as FAN_TYPE[]).filter(
    (fan) => fan.product === "premium",
  ).length;
  const freeCount = (fans as unknown as FAN_TYPE[]).filter(
    (fan) => fan.product === "free",
  ).length;

  const followers = await getFollows(client);

  return {
    fans,
    premiumCount,
    freeCount,
    followers,
  };
};

export default getFans;
