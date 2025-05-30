// YouTube API Response Types

export interface YouTubeStatusResponse {
  authenticated: boolean;
  message: string;
  expiresAt?: string;
  createdAt?: string;
}

export interface YouTubeChannelInfo {
  success: boolean;
  status: string;
  message?: string;
  channel?: {
    id: string;
    title: string;
    description: string;
    thumbnails: {
      default?: { url?: string | null };
      medium?: { url?: string | null };
      high?: { url?: string | null };
    };
    statistics: {
      subscriberCount: string;
      videoCount: string;
      viewCount: string;
    };
    customUrl?: string | null;
    country?: string | null;
    publishedAt: string;
  };
}

// Interface for tool result from checkYouTubeAccess
export interface YouTubeAccessResult {
  success: boolean;
  status: string;
  message?: string;
  channelInfo?: {
    id: string;
    name: string;
    thumbnails?: {
      default?: string | null;
      medium?: string | null;
      high?: string | null;
    };
    subscriberCount?: string;
    videoCount?: string;
    viewCount?: string;
    customUrl?: string | null;
    country?: string | null;
    publishedAt?: string | null;
  };
}

// Interface for detailed channel information from getYouTubeChannelInfo tool
export interface YouTubeChannelInfoResult {
  success: boolean;
  status: string;
  message?: string;
  channelInfo?: {
    // Basic channel information
    id: string;
    title: string;
    description: string;
    customUrl?: string | null;
    country?: string | null;
    publishedAt: string;
    
    // Channel thumbnails
    thumbnails: {
      default?: { url?: string | null };
      medium?: { url?: string | null };
      high?: { url?: string | null };
    };
    
    // Channel statistics
    statistics: {
      subscriberCount: string;
      videoCount: string;
      viewCount: string;
      hiddenSubscriberCount: boolean;
    };
    
    // Channel branding
    branding: {
      keywords?: string | null;
      defaultLanguage?: string | null;
    };
    
    // Authentication metadata
    authentication: {
      tokenCreatedAt: string;
      tokenExpiresAt: string;
    };
  };
}

// YouTube Channel Data Types (from channel-fetcher.ts)
export interface YouTubeChannelData {
  id: string;
  title: string;
  description: string;
  thumbnails: {
    default?: { url?: string | null };
    medium?: { url?: string | null };
    high?: { url?: string | null };
  };
  statistics: {
    subscriberCount: string;
    videoCount: string;
    viewCount: string;
    hiddenSubscriberCount?: boolean;
  };
  customUrl?: string | null;
  country?: string | null;
  publishedAt: string;
  branding?: {
    keywords?: string | null;
    defaultLanguage?: string | null;
  };
}

export interface YouTubeChannelFetchResult {
  success: boolean;
  channelData?: YouTubeChannelData;
  error?: {
    code: 'NO_CHANNELS' | 'API_ERROR';
    message: string;
  };
}

// Token Validation Types (from token-validator.ts)
export interface YouTubeTokenValidationResult {
  success: boolean;
  tokens?: YouTubeTokensRow;
  error?: {
    code: 'NO_TOKENS' | 'EXPIRED' | 'FETCH_ERROR';
    message: string;
  };
}

// Component Props Types
export interface YouTubeChannelDisplayProps {
  channel: YouTubeChannelData;
  artistName: string;
  isLive?: boolean;
}

export interface YouTubeErrorDisplayProps {
  artistName: string;
  errorMessage: string;
  onLogin: () => void;
  isLive?: boolean;
}

// YouTube Database Token Types
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