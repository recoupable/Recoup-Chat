import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";

const upsertArtist = async (artistName: string, userEmail: string) => {
  const client = getSupabaseServerAdminClient();
  const { data, error: insertError } = await client
    .from("artists")
    .insert({
      name: artistName,
      timestamp: Date.now(),
      email: userEmail,
    })
    .select("*")
    .single();

  if (insertError) throw insertError;

  return data;
};

export default upsertArtist;
