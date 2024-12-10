import { ArtistRecord } from "@/types/Artist";

const getArtistTikTokHandle = (artist: ArtistRecord | null) => {
  if (!artist) return "";
  const artistTikTokUrl = artist?.artist_social_links.find(
    (link) => link.type === "TIKTOK",
  );
  const atIndex = artistTikTokUrl?.link?.indexOf("@");
  const artistHandle = artistTikTokUrl?.link?.slice(atIndex);

  return artistHandle?.slice(1);
};

export default getArtistTikTokHandle;
