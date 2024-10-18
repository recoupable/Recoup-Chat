import { FAN_TYPE } from "@/types/fans";
import getPlaylist from "./getPlaylist";
import getEpisodes from "./getEpisodes";
import getRecentlyPlayed from "./getRecentlyPlayed";
import getFollowedArtists from "./getFollowedArtists";
import getSavedAlbums from "./getSavedAlbums";

const getFandata = (fan: FAN_TYPE) => {
  const playlist = getPlaylist(fan);
  const episode = getEpisodes(fan);
  const recentlyPlayed = getRecentlyPlayed(fan);
  const followedArtists = getFollowedArtists(fan);
  const albums = getSavedAlbums(fan);

  return {
    playlist,
    episode,
    recentlyPlayed,
    artists: followedArtists,
    albums,
  };
};

export default getFandata;
