import createSocialLink from "./createSocialLink";

const updateArtistSocials = async (
  artistId: string,
  tiktok_url: string,
  youtube_url: string,
  apple_url: string,
  instagram_url: string,
  twitter_url: string,
  spotify_url: string,
) => {
  const socialMediaLinks = [
    { type: "TIKTOK", url: tiktok_url },
    { type: "YOUTUBE", url: youtube_url },
    { type: "APPLE", url: apple_url },
    { type: "INSTAGRAM", url: instagram_url },
    { type: "TWITTER", url: twitter_url },
    { type: "SPOTIFY", url: spotify_url },
  ];

  // Iterate over the social media links and call createSocialLink
  await Promise.all(
    socialMediaLinks.map(({ type, url }) =>
      createSocialLink(artistId, type, url),
    ),
  );
};

export default updateArtistSocials;
