import { Track } from "@/types/Track";

const getTracks = (tracks: Array<Track>) => {
  const uniqueSavedTracks = tracks.reduce((acc: Track[], track: Track) => {
    const existingElement = acc.find(
      (element: Track) => element.uri === track.uri,
    );
    if (existingElement) Object.assign(existingElement, track);
    else acc.push(track);

    return acc;
  }, []);

  return uniqueSavedTracks;
};

export default getTracks;
