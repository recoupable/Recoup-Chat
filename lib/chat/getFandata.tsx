import { FAN_TYPE } from "@/types/fans";
import getPlaylist from "./getPlaylist";
import getEpisodes from "./getEpisodes";
import getSavedAlbums from "./getSavedAlbums";
import getAudioBooks from "./getAudioBooks";
import getShows from "./getShows";
import getTracks from "./getSavedTracks";
import getArtists from "./getArtists";
import { SpecificFocus } from "@/types/Campaign";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getArrayData = (fanData: any, method: any) => {
  return Array.isArray(fanData) ? method(fanData) : [];
};

const gatherListeningData = (fan: FAN_TYPE) => ({
  playlist: getPlaylist(fan),
  episode: getEpisodes(fan),
  recentlyPlayed: getTracks(getArrayData(fan.recentlyPlayed, getTracks)),
  followedArtists: getArtists(getArrayData(fan.followedArtists, getArtists)),
  albums: getSavedAlbums(fan),
  audioBooks: getAudioBooks(fan),
  shows: getShows(fan),
  savedTracks: getTracks(getArrayData(fan.savedTracks, getTracks)),
  topTracks: getTracks(getArrayData(fan.topTracks, getTracks)),
});

const gatherArtists = (fan: FAN_TYPE) => {
  const followedArtists = getArtists(
    getArrayData(fan.followedArtists, getArtists),
  );
  const topArtists = getArtists(getArrayData(fan.topArtists, getArtists));
  return [...topArtists, ...followedArtists];
};

const gatherTracks = (fan: FAN_TYPE) => {
  const savedTracks = getTracks(getArrayData(fan.savedTracks, getTracks));
  const topTracks = getTracks(getArrayData(fan.topTracks, getTracks));
  return [...savedTracks, ...topTracks];
};

const getFandata = (fan: FAN_TYPE, specific_focus: string) => {
  switch (specific_focus) {
    case SpecificFocus.listening_habits:
      const listeningData = gatherListeningData(fan);
      return {
        ...listeningData,
        tracks: gatherTracks(fan),
        artists: gatherArtists(fan),
      };

    case SpecificFocus.albums:
      return { albums: getSavedAlbums(fan) };

    case SpecificFocus.artists:
      return { artists: gatherArtists(fan) };

    case SpecificFocus.audio_books:
      return { audioBooks: getAudioBooks(fan) };

    case SpecificFocus.episodes:
      return { episode: getEpisodes(fan) };

    case SpecificFocus.playlist:
      return { playlist: getPlaylist(fan) };

    case SpecificFocus.tracks:
      return { tracks: gatherTracks(fan) };

    case SpecificFocus.shows:
      return { shows: getShows(fan) };

    default:
      return {};
  }
};

export default getFandata;
