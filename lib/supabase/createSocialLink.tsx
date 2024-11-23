import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";

const createSocialLink = async (
  artistId: string,
  social_type: string,
  social_link: string,
) => {
  const client = getSupabaseServerAdminClient();

  const { data } = await client
    .from("artist_social_links")
    .select("*")
    .eq("artistId", artistId)
    .eq("type", social_type);

  if (data && data?.length) {
    await client
      .from("artist_social_links")
      .update({
        ...data[0],
        link: social_link,
      })
      .eq("id", data[0].id);
    return;
  }

  await client.from("artist_social_links").insert({
    link: social_link,
    type: social_type,
    artistId: artistId,
  });
};

export default createSocialLink;
