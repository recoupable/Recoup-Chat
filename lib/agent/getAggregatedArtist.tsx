import { FUNNEL_ANALYSIS, SOCIAL_LINK } from "@/types/Agent";

const getAggregatedArtist = (funnel_analyses: Array<FUNNEL_ANALYSIS>) => {
  const socialLinks: Array<SOCIAL_LINK> = [];
  const profile =
    funnel_analyses.find(
      (funnel_analysis: FUNNEL_ANALYSIS) =>
        funnel_analysis.funnel_analytics_profile?.[0],
    ) || {};
  funnel_analyses.forEach((funnel_analysis: FUNNEL_ANALYSIS) => {
    const artistProfile = funnel_analysis.funnel_analytics_profile;
    if (artistProfile.length > 0) {
      socialLinks.push(...artistProfile[0].artists.artist_social_links);
    }
  });
  const socialLinkMap = new Map<string, SOCIAL_LINK>();
  socialLinks.forEach((link) => {
    if (!socialLinkMap.get(link.type) || link.link) {
      socialLinkMap.set(link.type, link);
    }
  });

  const aggregatedLinks: SOCIAL_LINK[] = Array.from(socialLinkMap.values());

  const image =
    (
      funnel_analyses.find((fa) => fa.funnel_analytics_profile?.[0]?.avatar) ||
      {}
    ).funnel_analytics_profile?.[0]?.avatar || "";
  const name =
    (
      funnel_analyses.find(
        (fa) => fa.funnel_analytics_profile?.[0]?.nickname,
      ) || {}
    ).funnel_analytics_profile?.[0]?.nickname || "";
  const id =
    (
      funnel_analyses.find((fa) => fa.funnel_analytics_profile?.[0]?.avatar) ||
      {}
    ).funnel_analytics_profile?.[0]?.artistId ||
    funnel_analyses?.[0]?.funnel_analytics_profile?.[0]?.artistId;

  return {
    image,
    name,
    instruction: "",
    label: "",
    artist_social_links: aggregatedLinks,
    bases: [],
    knowledges: [],
    id,
    profile,
    handle: funnel_analyses[0]?.handle || "",
  };
};

export default getAggregatedArtist;
