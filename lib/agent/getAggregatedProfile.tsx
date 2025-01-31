import { ARTIST_INFO } from "@/types/Artist";

const getAggregatedProfile = (
  funnelType: string,
  artist: ARTIST_INFO,
  existingArtist: ARTIST_INFO | null,
) => {
  const aggregatedArtistProfile =
    funnelType === "wrapped" && existingArtist
      ? {
          ...artist,
          ...existingArtist,
          isWrapped: true,
        }
      : artist;

  return aggregatedArtistProfile;
};

export default getAggregatedProfile;
