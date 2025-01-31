import getSocialPlatformByLink from "./getSocialPlatformByLink";

const getUserNameByProfileLink = (profileLink: string) => {
  const socialPlatform = getSocialPlatformByLink(profileLink);
  let match = profileLink.match(/\/\/[^/]+\/([^\/?#]+)/);
  if (socialPlatform === "SPOTIFY")
    match = profileLink.match(/\/artists\/([a-zA-Z0-9]+)\/?$/);
  return match ? match[1] : "";
};

export default getUserNameByProfileLink;
