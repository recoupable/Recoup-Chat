import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";

const upsertArtist = async (artistName: string, userEmail: string) => {
  const client = getSupabaseServerAdminClient();
  const { data: userData } = await client
    .from("accounts")
    .select("*")
    .eq("email", userEmail);

  let user = userData?.[0];

  if (!userData?.length) {
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

  const { data, error: insertError } = await client
    .from("artists")
    .insert({
      name: artistName,
      timestamp: Date.now(),
    })
    .select("*")
    .single();

  if (insertError) throw insertError;

  await client
    .from("accounts")
    .update({
      artistIds: [...(user.artistIds || []), data.id],
      email: userEmail,
      timestamp: Date.now(),
    })
    .eq("id", user.id);

  return data;
};

export default upsertArtist;
