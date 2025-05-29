// Temporary types for youtube_tokens table until database migration is run
export interface YouTubeTokensRow {
  id: string;
  artist_id: string;
  access_token: string;
  refresh_token: string | undefined;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface YouTubeTokensInsert {
  id?: string;
  artist_id: string;
  access_token: string;
  refresh_token?: string | undefined;
  expires_at: string;
  created_at?: string;
  updated_at?: string;
}

export interface YouTubeTokensUpdate {
  id?: string;
  artist_id?: string;
  access_token?: string;
  refresh_token?: string | undefined;
  expires_at?: string;
  created_at?: string;
  updated_at?: string;
} 