import { ACCOUNT_SOCIAL, ARTIST_INFO } from "@/types/Artist";
import getSocialPlatformByLink from "./getSocialPlatformByLink";

const getExistingHandles = (artist: ARTIST_INFO | null) => {
  if (!artist)
    return {
      twitter: "",
      spotify: "",
      tiktok: "",
      instagram: "",
    };

  const socials = artist.artist.account_socials.filter(
    (ele: ACCOUNT_SOCIAL) => {
      const profileUrl = ele.social.profile_url;
      const socialPlatform = getSocialPlatformByLink(profileUrl);
      return socialPlatform !== "APPPLE" && socialPlatform !== "YOUTUBE";
    },
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handles: any = {};

  socials.map((social: ACCOUNT_SOCIAL) => {
    const profileUrl = social.social.profile_url;
    const socialPlatform = getSocialPlatformByLink(profileUrl);
    let match = profileUrl.match(/\/\/[^/]+\/([^\/?#]+)/);
    if (socialPlatform === "YOUTUBE")
      match = profileUrl.match(/\/artists\/([a-zA-Z0-9]+)\/?$/);
    handles[`${socialPlatform.toLowerCase()}`] = match ? match[1] : "";
  });

  return handles;
};

export default getExistingHandles;
