import getFandata from "./getFandata";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";
import { FAN_TYPE } from "@/types/fans";
import { RecentlyPlayed } from "@/types/RecentlyPlayed";
import { Artist } from "@/types/Artist";
import { Album } from "@/types/Album";

const getFans = async (client: SupabaseClient<Database, "public">) => {
  const { data: fans } = await client.from("fans").select("*");

  if (!fans?.length) return "No fans.";

  let playlists: string[] = [];
  let episodes: string[] = [];
  let recentlyPlayed: Array<RecentlyPlayed> = [];
  let artists: Array<Artist> = [];
  let albums: Array<Album> = [];

  const rows = fans.map((fan) => {
    const data = getFandata(fan as unknown as FAN_TYPE);
    playlists = playlists.concat(data.playlist);
    episodes = episodes.concat(data.episode);
    recentlyPlayed = recentlyPlayed.concat(data.recentlyPlayed);
    artists = artists.concat(data.artists);
    albums = albums.concat(data.albums);
    return {};
  });

  playlists = playlists.slice(0, 50);
  episodes = episodes.slice(0, 50);

  const recentlyPlayedTracks = recentlyPlayed
    .sort((a: RecentlyPlayed, b: RecentlyPlayed) => b.popularity - a.popularity)
    .map((played: RecentlyPlayed) => played.name || "")
    .slice(0, 50);

  const artistNames = artists
    .sort((a: Artist, b: Artist) => b.popularity - a.popularity)
    .map((played: Artist) => played.name || "")
    .slice(0, 50);

  const albumNames = albums
    .sort((a: Album, b: Album) => b.popularity - a.popularity)
    .map((played: Album) => played.name || "")
    .slice(0, 50);

  return rows.join("\n\t");
};

export default getFans;
