import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";

const readArtists = async (userEmail: string) => {
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

  const { data: artists, error } = await client
    .from("artists")
    .select("*")
    .in("id", user.artistIds || []);

  if (error) throw error;

  return artists || [];
};

export default readArtists;
