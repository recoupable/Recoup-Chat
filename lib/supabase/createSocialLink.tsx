import supabase from "./serverClient";

const createSocialLink = async (
  artistId: string,
  social_type: string,
  social_link: string,
) => {
  const { data } = await supabase
    .from("account_socials")
    .select("*")
    .eq("account_id", artistId)
    .eq("type", social_type)
    .single();

  if (data) {
    await supabase
      .from("account_socials")
      .update({
        ...data,
        link: social_link,
      })
      .eq("id", data.id)
      .select("*")
      .single();
    return;
  }

  await supabase.from("account_socials").insert({
    link: social_link,
    type: social_type,
    account_id: artistId,
  });
};

export default createSocialLink;
