import { Artist } from "@/types/Artist";
import { FAN_TYPE } from "@/types/fans";

const getFollowedArtists = (fan: FAN_TYPE) => {
  const followedArtists = Array.isArray(fan.followedArtists)
    ? fan.followedArtists
    : [];
  const uniqueFollowedArtists = followedArtists.reduce(
    (acc: Artist[], artist: Artist) => {
      const existingElement = acc.find(
        (element: Artist) => artist.uri === artist.uri,
      );
      if (existingElement) Object.assign(existingElement, artist);
      else acc.push(artist);

      return acc;
    },
    [],
  );

  return uniqueFollowedArtists;
};

export default getFollowedArtists;
