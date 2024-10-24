import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";
import { FAN_TYPE } from "@/types/fans";
import getFollows from "./getFollows";
import limitCollections from "../limitCollections";
import getPlaylist from "./getPlaylist";
import getEpisodes from "./getEpisodes";
import getAudioBooks from "./getAudioBooks";
import getSavedAlbums from "./getSavedAlbums";
import getTracks from "./getSavedTracks";
import getShows from "./getShows";
import getSortedNames from "../getSortedNames";
import getArtists from "./getArtists";

const getCampaign = async (client: SupabaseClient<Database, "public">) => {
  const { data: fans } = await client.from("fans").select("*");

  if (!fans?.length) return "No fans.";

  const {
    playlist,
    artists,
    episodes,
    albums,
    audioBooks,
    shows,
    tracks,
    fansdata,
  } = fans.reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (acc: any, fan) => {
      acc.playlist.push(...(Array.isArray(fan.playlist) ? fan.playlist : []));
      if (Array.isArray(fan.followedArtists)) {
        acc.artists.push(...fan.followedArtists);
      }
      if (Array.isArray(fan.topArtists)) {
        acc.artists.push(...fan.topArtists);
      }
      acc.episodes.push(...(Array.isArray(fan.episodes) ? fan.episodes : []));
      acc.albums.push(
        ...(Array.isArray(fan.savedAlbums) ? fan.savedAlbums : []),
      );
      acc.audioBooks.push(
        ...(Array.isArray(fan.savedAudioBooks) ? fan.savedAudioBooks : []),
      );
      acc.shows.push(...(Array.isArray(fan.savedShows) ? fan.savedShows : []));
      if (Array.isArray(fan.topTracks)) {
        acc.tracks.push(...fan.topTracks);
      }
      if (Array.isArray(fan.savedTracks)) {
        acc.tracks.push(...fan.savedTracks);
      }
      acc.fansdata.push({
        name: fan.display_name || "Unknown",
        country: fan.country || "Unknown",
        city: fan.city || "Unknown",
      });
      return acc;
    },
    {
      playlist: [],
      artists: [],
      episodes: [],
      albums: [],
      audioBooks: [],
      shows: [],
      tracks: [],
      fansdata: [],
    },
  );

  const premiumCount = (fans as unknown as FAN_TYPE[]).filter(
    (fan) => fan.product === "premium",
  ).length;

  const freeCount = (fans as unknown as FAN_TYPE[]).filter(
    (fan) => fan.product === "free",
  ).length;

  const followers = await getFollows(client);

  return {
    playlist: limitCollections(getPlaylist(playlist)),
    artists: getSortedNames(getArtists(artists), "name"),
    episodes: limitCollections(getEpisodes(episodes)),
    albums: getSortedNames(getSavedAlbums(albums), "name"),
    tracks: getSortedNames(getTracks(tracks), "name"),
    shows: limitCollections(getShows(shows)),
    audioBooks: limitCollections(getAudioBooks(audioBooks)),
    premiumCount,
    freeCount,
    followers,
    totalFansCount: premiumCount + freeCount,
    fans: fansdata,
  };
};

export default getCampaign;
