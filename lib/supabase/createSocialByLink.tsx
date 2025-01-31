import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import getSocialPlatformByLink from "../getSocialPlatformByLink";
import { ACCOUNT_SOCIAL } from "@/types/Artist";
import getUserNameByProfileLink from "../getUserNameByProfileLink";

const createSocialByLink = async (artistId: string, profile_url: string) => {
  const client = getSupabaseServerAdminClient();

  const { data: social } = await client
    .from("socials")
    .select("*")
    .eq("profile_url", profile_url)
    .single();

  const { data: account_socials } = await client
    .from("account_socials")
    .select("*, social:socials(*)")
    .eq("account_id", artistId);

  const existingSocial = account_socials?.find((ele: ACCOUNT_SOCIAL) => {
    const socialPlatform = getSocialPlatformByLink(ele.social.profile_url);
    return (
      socialPlatform === getSocialPlatformByLink(profile_url) &&
      ele.social.profile_url !== profile_url
    );
  });

  if (existingSocial) {
    await client
      .from("account_socials")
      .delete()
      .eq("account_id", artistId)
      .eq("social_id", existingSocial.social.id);
  }

  if (social) {
    const { data: account_social } = await client
      .from("account_socials")
      .select("*")
      .eq("account_id", artistId)
      .eq("social_id", social.id);
    if (account_social?.length) return;
    await client.from("account_socials").insert({
      account_id: artistId,
      social_id: social.id,
    });
  } else {
    const { data: new_social } = await client
      .from("socials")
      .insert({
        profile_url,
        username: getUserNameByProfileLink(profile_url),
      })
      .select("*")
      .single();
    await client.from("account_socials").insert({
      account_id: artistId,
      social_id: new_social.id,
    });
  }
};

export default createSocialByLink;
