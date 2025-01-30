import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";

type FanProfile = {
  id: string;
  // Add other fan properties as needed
};

type RpcResponse = {
  fans: FanProfile[];
};

const getTopSongListeningFansCount = async (
  artistId: string,
  email: string
): Promise<number> => {
  try {
    const client = getSupabaseServerAdminClient();
    const { data } = await client.rpc("get_fans_listening_top_songs", {
      artistid: artistId,
      email: email,
    });

    if (
      !data ||
      typeof data !== "object" ||
      !Array.isArray((data as RpcResponse).fans)
    ) {
      return 0;
    }

    return (data as RpcResponse).fans.length;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

export default getTopSongListeningFansCount;
