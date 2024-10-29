import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";

const readArtists = async (userEmail: string) => {
  const client = getSupabaseServerAdminClient();
  const { data: artists, error } = await client
    .from("artists")
    .select("*")
    .eq("email", userEmail);
  if (error) throw error;

  return artists || [];
};

export default readArtists;
