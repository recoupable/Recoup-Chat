// Types for youtube_tokens table
export interface YouTubeTokensRow {
  id: string;
  account_id: string;
  access_token: string;
  refresh_token: string | undefined;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface YouTubeTokensInsert {
  id?: string;
  account_id: string;
  access_token: string;
  refresh_token?: string | undefined;
  expires_at: string;
  created_at?: string;
  updated_at?: string;
}

export interface YouTubeTokensUpdate {
  id?: string;
  account_id?: string;
  access_token?: string;
  refresh_token?: string | undefined;
  expires_at?: string;
  created_at?: string;
  updated_at?: string;
} 