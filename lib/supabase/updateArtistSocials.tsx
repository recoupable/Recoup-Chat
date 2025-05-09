import getSocialPlatformByLink from "../getSocialPlatformByLink";
import getUserNameByProfileLink from "../getUserNameByProfileLink";
import getAccountSocialsByAccountId, {
  AccountSocialWithSocial,
} from "./accountSocials/getAccountSocialsByAccountId";
import deleteAccountSocial from "./accountSocials/deleteAccountSocial";
import insertAccountSocial from "./accountSocials/insertAccountSocial";
import getAccountSocialByAccountAndSocialId from "./accountSocials/getAccountSocialByAccountAndSocialId";
import getSocialByProfileUrl from "./socials/getSocialByProfileUrl";
import insertSocial from "./socials/insertSocial";

const updateArtistSocials = async (
  artistId: string,
  profileUrls: Record<string, string>
) => {
  const account_socials: AccountSocialWithSocial[] =
    await getAccountSocialsByAccountId(artistId);

  const profilePromises = Object.entries(profileUrls).map(
    async ([type, value]) => {
      const social = value ? await getSocialByProfileUrl(value) : null;
      const existingSocial = account_socials?.find(
        (account_social: AccountSocialWithSocial) =>
          getSocialPlatformByLink(account_social.social.profile_url) === type
      );

      if (existingSocial) {
        await deleteAccountSocial(artistId, existingSocial.social.id);
      }
      if (value) {
        if (social) {
          const accountSocial = await getAccountSocialByAccountAndSocialId(
            artistId,
            social.id
          );
          if (!accountSocial) {
            await insertAccountSocial(artistId, social.id);
          }
        } else {
          const new_social = await insertSocial(
            getUserNameByProfileLink(value),
            value
          );
          if (new_social) {
            await insertAccountSocial(artistId, new_social.id);
          }
        }
      }
    }
  );

  await Promise.all(profilePromises);
};

export default updateArtistSocials;
