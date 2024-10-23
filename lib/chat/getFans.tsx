import getFandata from "./getFandata";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";
import { FAN_TYPE } from "@/types/fans";
import { Artist } from "@/types/Artist";
import { Album } from "@/types/Album";
import { Track } from "@/types/Track";
import getFollows from "./getFollows";
import getFanSegments from "./getFanSegments";
import getSortedLimitedNames from "../getSortedLimitedNames";

const getFans = async (client: SupabaseClient<Database, "public">) => {
  const { activeFans, casualFans, superFans } = await getFanSegments(client);

  const { data: fans } = await client.from("fans").select("*");

  if (!fans?.length) return "No fans.";

  let playlists: string[] = [];
  let episodes: string[] = [];
  let artists: Array<Artist> = [];
  let albums: Array<Album> = [];
  let audioBooks: Array<string> = [];
  let shows: Array<string> = [];
  let tracks: Array<Track> = [];
  const premiumCount = (fans as unknown as FAN_TYPE[]).filter(
    (fan) => fan.product === "premium",
  ).length;
  const freeCount = (fans as unknown as FAN_TYPE[]).filter(
    (fan) => fan.product === "free",
  ).length;

  const rows = fans.map((fan) => {
    const data = getFandata(fan as unknown as FAN_TYPE);
    playlists = playlists.concat(data.playlist);
    episodes = episodes.concat(data.episode);
    artists = artists.concat(data.artists);
    albums = albums.concat(data.albums);
    audioBooks = audioBooks.concat(data.audioBooks);
    shows = shows.concat(data.shows);
    tracks = tracks.concat(data.tracks);
    let segment = "No Listener";
    if (casualFans?.includes(fan.id)) segment = "Casual Listener";
    if (activeFans?.includes(fan.id)) segment = "Active Listener";
    if (superFans?.includes(fan.id)) segment = "Super Listener";

    return {
      name: fan.display_name || "Unknown",
      country: fan.country || "Unknown",
      city: fan.city || "Unknown",
      segment,
    };
  });

  playlists = playlists.slice(0, 50);
  episodes = episodes.slice(0, 50);
  audioBooks = audioBooks.slice(0, 50);

  const artistNames = getSortedLimitedNames(artists);
  const albumNames = getSortedLimitedNames(albums);
  const trackNames = getSortedLimitedNames(tracks);

  const followers = await getFollows(client);

  return {
    tracks: trackNames,
    artists: artistNames,
    playlists,
    albums: albumNames,
    audioBooks,
    episodes,
    shows,
    fans: rows,
    premiumCount,
    freeCount,
    totalFansCount: premiumCount + freeCount,
    totalFollowersCount: followers,
    casualFansCount: casualFans?.length || 0,
    activeFansCount: activeFans?.length || 0,
    superFansCount: superFans?.length || 0,
  };
};

export default getFans;
