// Spotify Artist Search Result Type
export interface SpotifyArtistSearchResult {
  id: string;
  name: string;
  type: "artist";
  uri: string;
  external_urls: { spotify: string };
  images: { url: string; height: number; width: number }[];
  popularity: number;
  genres: string[];
  followers: { href: string | null; total: number };
}

// Spotify Album Search Result Type
export interface SpotifyAlbumSearchResult {
  id: string;
  name: string;
  type: "album";
  uri: string;
  external_urls: { spotify: string };
  images: { url: string; height: number; width: number }[];
  artists: SpotifyArtistSearchResult[];
}

// Spotify Track Search Result Type
export interface SpotifyTrackSearchResult {
  id: string;
  name: string;
  type: "track";
  uri: string;
  external_urls: { spotify: string };
  album: SpotifyAlbumSearchResult;
  artists: SpotifyArtistSearchResult[];
  duration_ms: number;
  explicit: boolean;
  popularity: number;
  preview_url?: string;
}

// Spotify Playlist Search Result Type
export interface SpotifyPlaylistSearchResult {
  id: string;
  name: string;
  type: "playlist";
  uri: string;
  external_urls: { spotify: string };
  images: { url: string; height: number; width: number }[];
  owner: {
    display_name: string;
    id: string;
    external_urls: { spotify: string };
  };
  description: string;
  public: boolean;
  tracks: { href: string; total: number };
}

// Spotify Show Search Result Type
export interface SpotifyShowSearchResult {
  id: string;
  name: string;
  type: "show";
  uri: string;
  external_urls: { spotify: string };
  images: { url: string; height: number; width: number }[];
  publisher: string;
  description: string;
  total_episodes: number;
}

// Spotify Episode Search Result Type
export interface SpotifyEpisodeSearchResult {
  id: string;
  name: string;
  type: "episode";
  uri: string;
  external_urls: { spotify: string };
  images: { url: string; height: number; width: number }[];
  description: string;
  duration_ms: number;
  release_date: string;
  explicit: boolean;
  audio_preview_url?: string;
}

// Spotify Audiobook Search Result Type
export interface SpotifyAudiobookSearchResult {
  id: string;
  name: string;
  type: "audiobook";
  uri: string;
  external_urls: { spotify: string };
  images: { url: string; height: number; width: number }[];
  publisher: string;
  description: string;
  total_chapters: number;
}

// API Response Type (fully typed)
export interface SpotifySearchResponse {
  artists?: { items: SpotifyArtistSearchResult[]; total: number };
  albums?: { items: SpotifyAlbumSearchResult[]; total: number };
  tracks?: { items: SpotifyTrackSearchResult[]; total: number };
  playlists?: { items: SpotifyPlaylistSearchResult[]; total: number };
  shows?: { items: SpotifyShowSearchResult[]; total: number };
  episodes?: { items: SpotifyEpisodeSearchResult[]; total: number };
  audiobooks?: { items: SpotifyAudiobookSearchResult[]; total: number };
  [key: string]: unknown;
}
