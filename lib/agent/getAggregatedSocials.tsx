import { SOCIAL_LINK } from "@/types/Agent";

const getAggregatedSocials = (socialLinks: Array<SOCIAL_LINK>) => {
  const socialLinkMap = new Map<string, SOCIAL_LINK>();
  socialLinks.forEach((link) => {
    if (!socialLinkMap.get(link.type) || link.link) {
      socialLinkMap.set(link.type, link);
    }
  });

  const aggregatedLinks: SOCIAL_LINK[] = Array.from(socialLinkMap.values());

  return aggregatedLinks;
};

export default getAggregatedSocials;
