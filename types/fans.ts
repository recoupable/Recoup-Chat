import { Album } from "./Album";
import { Artist } from "./Artist";
import { Episode } from "./Episodes";
import { Playlist } from "./Playlist";
import { RecentlyPlayed } from "./RecentlyPlayed";

export type FAN_TYPE = {
  country: string | null;
  city: string | null;
  product: string | null;
  playlist: Array<Playlist> | null;
  episodes: Array<Episode> | null;
  recentlyPlayed: Array<RecentlyPlayed> | null;
  followedArtists: Array<Artist> | null;
  savedAlbums: Array<Album> | null;
};
