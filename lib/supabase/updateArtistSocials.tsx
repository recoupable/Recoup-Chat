import getSocialPlatformByLink from "../getSocialPlatformByLink";
import getUserNameByProfileLink from "../getUserNameByProfileLink";
import getAccountSocials, {
  AccountSocialWithSocial,
} from "./accountSocials/getAccountSocials";
import deleteAccountSocial from "./accountSocials/deleteAccountSocial";
import insertAccountSocial from "./accountSocials/insertAccountSocial";
import getSocialByProfileUrl from "./socials/getSocialByProfileUrl";
import insertSocials from "./socials/insertSocials";

const updateArtistSocials = async (
  artistId: string,
  profileUrls: Record<string, string>
): Promise<AccountSocialWithSocial[]> => {
  const account_socials: AccountSocialWithSocial[] = await getAccountSocials({
    accountId: artistId,
  });

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
          const existing = await getAccountSocials({
            accountId: artistId,
            socialId: social.id,
          });
          if (existing.length === 0) {
            await insertAccountSocial(artistId, social.id);
          }
        } else {
          const new_socials = await insertSocials([{
            username: getUserNameByProfileLink(value),
            profile_url: value,
          }]);
          if (new_socials.length > 0) {
            await insertAccountSocial(artistId, new_socials[0].id);
          }
        }
      }
    }
  );

  await Promise.all(profilePromises);

  // Return the latest joined records
  return await getAccountSocials({ accountId: artistId });
};

export default updateArtistSocials;
