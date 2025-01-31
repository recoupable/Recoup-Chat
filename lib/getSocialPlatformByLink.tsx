const getSocialPlatformByLink = (link: string) => {
  if (link.includes("x.com") || link.includes("twitter.com")) return "TWITTER";
  if (link.includes("instagram.com")) return "INSTAGRAM";
  if (link.includes("spotify.com")) return "SPOTIFY";
  if (link.includes("tiktok.com")) return "TIKTOK";
  if (link.includes("apple.com")) return "APPPLE";
  if (link.includes("youtube.")) return "YOUTUBE";

  return "NONE";
};

export default getSocialPlatformByLink;
