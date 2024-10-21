import getFandata from "./getFandata";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";
import { FAN_TYPE } from "@/types/fans";
import { Artist } from "@/types/Artist";
import { Album } from "@/types/Album";
import { Track } from "@/types/Track";
import getFollows from "./getFollows";

const getFans = async (
  client: SupabaseClient<Database, "public">,
  fanName = "",
) => {
  const query = client.from("fans").select("*");

  if (fanName) {
    query.ilike("display_name", `%${fanName}%`);
  }
  const { data: fans } = await query;
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
    return {
      name: fan.display_name || "Unknown",
      country: fan.country || "Unknown",
      city: fan.city || "Unknown",
    };
  });

  playlists = playlists.slice(0, 50);
  episodes = episodes.slice(0, 50);
  audioBooks = audioBooks.slice(0, 50);

  const artistNames = artists
    .sort((a: Artist, b: Artist) => b.popularity - a.popularity)
    .map((played: Artist) => played.name || "")
    .slice(0, 50);

  const albumNames = albums
    .sort((a: Album, b: Album) => b.popularity - a.popularity)
    .map((played: Album) => played.name || "")
    .slice(0, 50);

  const trackNames = tracks
    .sort((a: Track, b: Track) => b.popularity - a.popularity)
    .map((played: Track) => played.name || "")
    .slice(0, 50);

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
  };
};

export default getFans;
