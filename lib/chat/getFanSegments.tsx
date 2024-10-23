import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

const getFanSegments = async (client: SupabaseClient<Database, "public">) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: maxdata }: any = await client
    .from("spotify_play_button_clicked")
    .select("timestamp.max()");
  const maxTimestamp = parseInt(maxdata?.[0]?.max, 10);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: mindata }: any = await client
    .from("spotify_play_button_clicked")
    .select("timestamp.min()");
  const minTimestamp = parseInt(mindata?.[0]?.min, 10);

  const periodDays = parseInt(
    Number((maxTimestamp - minTimestamp) / (24 * 1000 * 60 * 60)).toFixed(0),
    10,
  );

  const casualLimit = 1 * periodDays;
  const activeLimit = 4 * periodDays;
  const superLimit = 5 * periodDays;

  const { data: fans } = await client
    .from("spotify_play_button_clicked")
    .select("fanId, count()");

  const casualFans = fans
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ?.filter((fan: any) => fan.count >= casualLimit && fan.count < activeLimit)
    .map((fan) => fan.fanId);
  const activeFans = fans
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ?.filter((fan: any) => fan.count >= activeLimit && fan.count < superLimit)
    .map((fan) => fan.fanId);
  const superFans = fans
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ?.filter((fan: any) => fan.count >= superLimit)
    .map((fan) => fan.fanId);

  return {
    casualFans,
    activeFans,
    superFans,
  };
};

export default getFanSegments;
