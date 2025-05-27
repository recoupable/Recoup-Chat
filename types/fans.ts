import { Album } from "./Album";
import { Artist } from "./Artist";
import { AudioBook } from "./AudioBook";
import { Episode } from "./Episodes";
import { Playlist } from "./Playlist";
import { Show } from "./Show";
import { Track } from "./Track";

export type FAN_TYPE = {
  display_name: string | null;
  name: string | null;
  country: string | null;
  city: string | null;
  product: string | null;
  playlist: Array<Playlist> | null;
  episodes: Array<Episode> | null;
  recentlyPlayed: Array<Track> | null;
  followedArtists: Array<Artist> | null;
  savedAlbums: Array<Album> | null;
  savedAudioBooks: Array<AudioBook> | null;
  savedShows: Array<Show> | null;
  savedTracks: Array<Track> | null;
  topTracks: Array<Track> | null;
  topArtists: Array<Artist> | null;
  email: string;
  timestamp: string | null;
};

// Fan profile interface
export interface Fan {
  id: string;
  username: string;
  avatar: string;
  profile_url: string;
  segment_id: string;
  segment_name: string;
  fan_social_id: string;
  region: string;
  bio: string;
  follower_count: number;
  following_count: number;
  updated_at: string;
}

// Response pagination interface
export interface Pagination {
  total_count: number;
  page: number;
  limit: number;
  total_pages: number;
}

// API response format
export interface FanResponse {
  status: "success" | "error";
  fans: Fan[];
  pagination: Pagination;
}

// Final response format with success flag
export interface SegmentFansResult {
  success: boolean;
  status: "success" | "error";
  fans: Fan[];
  pagination: Pagination;
  message?: string;
}
