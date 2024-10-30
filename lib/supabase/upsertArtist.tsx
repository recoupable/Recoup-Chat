import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";

const upsertArtist = async (artistName: string, userEmail: string) => {
  const client = getSupabaseServerAdminClient();
  const { data: userData, error: updateError } = await client
    .from("accounts")
    .select("*")
    .eq("email", userEmail)
    .single();

  let user = userData;

  if (!userData) {
    const newUserData = await client
      .from("accounts")
      .insert({
        email: userEmail,
        timestamp: Date.now(),
        artistIds: [],
      })
      .select("*")
      .single();
    user = newUserData;
  }

  const { data: found, error } = await client
    .from("artists")
    .select("*")
    .eq("name", artistName);

  if (error) throw error;

  if (found?.length) {
    const artistIds = user.artistIds || [];
    if (!artistIds.includes(found[0].id)) {
      await client
        .from("accounts")
        .update({
          artistIds: [...artistIds, found[0].id],
          timestamp: Date.now(),
          email: userEmail,
        })
        .eq("id", user.id);
    }
    if (updateError) throw updateError;

    return found[0];
  }

  const { data, error: insertError } = await client
    .from("artists")
    .insert({
      name: artistName,
      timestamp: Date.now(),
    })
    .select("*")
    .single();

  await client
    .from("accounts")
    .update({
      artistIds: [...(user.artistIds || []), data.id],
      email: userEmail,
      timestamp: Date.now(),
    })
    .eq("id", user.id);

  if (insertError) throw insertError;

  return data;
};

export default upsertArtist;
