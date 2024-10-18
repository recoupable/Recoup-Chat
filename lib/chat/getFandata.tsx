import { FAN_TYPE } from "@/types/fans";
import getPlaylist from "./getPlaylist";
import getEpisodes from "./getEpisodes";
import getSavedAlbums from "./getSavedAlbums";
import getAudioBooks from "./getAudioBooks";
import getShows from "./getShows";
import getTracks from "./getSavedTracks";
import getArtists from "./getArtists";

const getFandata = (fan: FAN_TYPE) => {
  const playlist = getPlaylist(fan);
  const episode = getEpisodes(fan);
  const recentlyPlayed = getTracks(
    Array.isArray(fan.recentlyPlayed) ? fan.recentlyPlayed : [],
  );
  const followedArtists = getArtists(
    Array.isArray(fan.followedArtists) ? fan.followedArtists : [],
  );
  const albums = getSavedAlbums(fan);
  const audioBooks = getAudioBooks(fan);
  const shows = getShows(fan);
  const savedTracks = getTracks(
    Array.isArray(fan.savedTracks) ? fan.savedTracks : [],
  );
  const topTracks = getTracks(
    Array.isArray(fan.topTracks) ? fan.topTracks : [],
  );
  const tracks = [...savedTracks, ...topTracks];
  const topArtists = getArtists(
    Array.isArray(fan.topArtists) ? fan.topArtists : [],
  );
  const artists = [...topArtists, ...followedArtists];

  return {
    playlist,
    episode,
    recentlyPlayed,
    artists,
    albums,
    audioBooks,
    shows,
    tracks,
  };
};

export default getFandata;
