import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";

const upsertArtist = async (artistName: string, userEmail: string) => {
  const client = getSupabaseServerAdminClient();
  const { data: found, error } = await client
    .from("artists")
    .select("*")
    .eq("name", artistName);
  if (error) throw error;

  if (found.length > 0) {
    const { data, error: updateError } = await client
      .from("artists")
      .update({
        name: artistName,
        email: userEmail,
        timestamp: Date.now(),
      })
      .eq("id", found[0].id)
      .select("*")
      .single();
    if (updateError) throw updateError;

    return data;
  }

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
