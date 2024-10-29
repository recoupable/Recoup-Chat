import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";

const readArtists = async (userEmail: string) => {
  const client = getSupabaseServerAdminClient();
  const { data: userData } = await client
    .from("accounts")
    .select("*")
    .eq("email", userEmail)
    .single();

  const { data: artists, error } = await client
    .from("artists")
    .select("*")
    .in("id", userData.artistIds || []);

  if (error) throw error;

  return artists || [];
};

export default readArtists;
