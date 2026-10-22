const SOCIAL_DOMAINS = [
  ["x.com", "TWITTER"],
  ["twitter.com", "TWITTER"],
  ["instagram.com", "INSTAGRAM"],
  ["spotify.com", "SPOTIFY"],
  ["tiktok.com", "TIKTOK"],
  // Stored-record matching still uses this legacy key; API callers normalize it.
  ["apple.com", "APPPLE"],
  ["youtube.com", "YOUTUBE"],
  ["youtu.be", "YOUTUBE"],
  ["facebook.com", "FACEBOOK"],
  ["threads.net", "THREADS"],
  ["threads.com", "THREADS"],
] as const;

const getSocialPlatformByLink = (link: string) => {
  if (!link) return "NONE";
  let hostname: string;
  try {
    hostname = new URL(
      link.includes("://") ? link : `https://${link}`,
    ).hostname.toLowerCase();
  } catch {
    return "NONE";
  }

  return (
    SOCIAL_DOMAINS.find(
      ([domain]) => hostname === domain || hostname.endsWith(`.${domain}`),
    )?.[1] ?? "NONE"
  );
};

export default getSocialPlatformByLink;
