import { Playlist } from "@/types/Playlist";

const getPlaylist = (playlist: Playlist[]) => {
  const uniquePlaylists =
    playlist
      .reduce((acc: Playlist[], playlist: Playlist) => {
        const existingElement = acc.find(
          (element: Playlist) => element.uri === playlist.uri,
        );
        if (existingElement) Object.assign(existingElement, playlist);
        else acc.push(playlist);

        return acc;
      }, [])
      .map((playlist: Playlist) => playlist.name || "") || [];

  return uniquePlaylists;
};

export default getPlaylist;
