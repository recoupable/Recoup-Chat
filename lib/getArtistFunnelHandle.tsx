import { ArtistRecord } from "@/types/Artist";

const getArtistFunnelHandle = (
  artist: ArtistRecord | null,
  funnelType: string,
) => {
  if (!artist) return "";
  const artistTikTokUrl = artist?.artist_social_links.find(
    (link) => link.type === funnelType,
  );
  const atIndex = artistTikTokUrl?.link?.indexOf("@");
  const artistHandle = artistTikTokUrl?.link?.slice(atIndex);

  return artistHandle?.toLowerCase()?.slice(1);
};

export default getArtistFunnelHandle;
