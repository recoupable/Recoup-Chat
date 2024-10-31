import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";

const upsertCampaign = async (artist_id: string, client_id: string) => {
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

  if (insertError) throw insertError;

  return data;
};

export default upsertCampaign;
