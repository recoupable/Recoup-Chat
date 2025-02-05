import getSocialPlatformByLink from "../getSocialPlatformByLink";
import getUserNameByProfileLink from "../getUserNameByProfileLink";
import supabase from "./serverClient";

const updateArtistSocials = async (artistId: string, profileUrls: string) => {
  const { data: account_socials } = await supabase
    .from("account_socials")
    .select("*, social:socials(*)")
    .eq("account_id", artistId);

  const profilePromises = Object.entries(profileUrls).map(
    async ([type, value]) => {
      const { data: social } = await supabase
        .from("socials")
        .select("*")
        .eq("profile_url", value)
        .neq("profile_url", "")
        .single();
      const existingSocial = account_socials?.find(
        // eslint-disable-next-line
        (account_social: any) =>
          getSocialPlatformByLink(account_social.social.profile_url) === type,
      );

      if (existingSocial) {
        await supabase
          .from("account_socials")
          .delete()
          .eq("account_id", artistId)
          .eq("social_id", existingSocial.social.id);
      }
      if (value) {
        if (social) {
          const { data: socials } = await supabase
            .from("account_socials")
            .select("*")
            .eq("account_id", artistId)
            .eq("social_id", social.id);
          if (!socials?.length) {
            await supabase.from("account_socials").insert({
              account_id: artistId,
              social_id: social.id,
            });
          }
        } else {
          const { data: new_social } = await supabase
            .from("socials")
            .insert({
              username: getUserNameByProfileLink(value),
              profile_url: value,
            })
            .select("*")
            .single();

          if (new_social)
            await supabase.from("account_social").insert({
              account_id: artistId,
              social_id: new_social.id,
            });
        }
      }
    },
  );

  await Promise.all(profilePromises);
};

export default updateArtistSocials;
