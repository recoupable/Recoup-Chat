import { AGENT_API } from "../consts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getArtistAlbums = async (artistId: string) => {
  const response = await fetch(
    `${AGENT_API}/api/get_artist_albums?artistId=${artistId}`,
  );
  if (!response.ok) {
    const error = await response.text();
    return { error };
  }

  const data = await response.json();
  const albums = data.albums;

  return albums;
};

export default getArtistAlbums;
