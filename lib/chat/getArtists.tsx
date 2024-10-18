import { Artist } from "@/types/Artist";

const getArtists = (artists: Array<Artist>) => {
  const uniqueArtists = artists.reduce((acc: Artist[], artist: Artist) => {
    const existingElement = acc.find(
      (element: Artist) => element.uri === artist.uri,
    );
    if (existingElement) Object.assign(existingElement, artist);
    else acc.push(artist);

    return acc;
  }, []);

  return uniqueArtists;
};

export default getArtists;
