import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import readArtists from "./readArtists";
import { validate } from "uuid";

const upsertCampaign = async (
  artist_id: string | undefined,
  client_id: string | undefined,
  email: string,
) => {
  const artists = await readArtists(email);
  try {
    if (!artist_id || !client_id || !validate(artist_id || "")) {
      return { error: "null values.", artists };
    }

    const client = getSupabaseServerAdminClient();

    const { data, error: insertError } = await client
      .from("campaigns")
      .insert({
        artistId: artist_id,
        clientId: client_id,
        timestamp: Date.now(),
      })
      .select("*")
      .single();

    if (insertError) return { error: insertError, artists };
    return data;
  } catch (error) {
    return {
      error,
      artists,
    };
  }
};

export default upsertCampaign;
