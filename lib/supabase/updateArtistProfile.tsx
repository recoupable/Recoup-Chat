import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";

const updateArtistProfile = async (
  artistId: string,
  email: string,
  image: string,
  name: string,
) => {
  const client = getSupabaseServerAdminClient();

  if (artistId) {
    const { data } = await client
      .from("artists")
      .select("*")
      .eq("id", artistId);

    if (!data || !data?.length) throw Error("artist does not exist.");

    const artistData = data[0];

    const { data: artistInfo } = await client
      .from("artists")
      .update({
        ...artistData,
        image,
        name,
      })
      .eq("id", artistId)
      .select("*");

    return artistInfo?.[0].id;
  } else {
    const { data: artistInfo } = await client
      .from("artists")
      .insert({
        image,
        name,
        timestamp: Date.now(),
      })
      .select("*")
      .single();

    const { data: account } = await client
      .from("accounts")
      .select("*")
      .eq("email", email);
    if (!account || !account.length) throw Error("Account does not exist.");

    await client
      .from("accounts")
      .update({
        ...account[0],
        artistIds: [...account[0].artistIds, artistInfo.id],
      })
      .eq("id", account[0].id);
    return artistInfo.id;
  }
};

export default updateArtistProfile;
