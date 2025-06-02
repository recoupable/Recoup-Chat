// YouTube API Response Types

import type { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";

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

// YouTube Mapping Types (from channel-mapper.ts)
// Union type for thumbnail formats used in channel data mapping
export type ThumbnailSource = {
  default?: string | { url?: string | null } | null;
  medium?: string | { url?: string | null } | null;
  high?: string | { url?: string | null } | null;
} | undefined;

// Union type for sources that might have statistics in different formats
export type StatisticsSource = {
  subscriberCount?: string;
  videoCount?: string;
  viewCount?: string;
  statistics?: {
    subscriberCount?: string;
    videoCount?: string;
    viewCount?: string;
  };
};

// Type for raw channel info that can come from various sources
export interface RawChannelInfo {
  id?: string;
  name?: string;
  title?: string;
  description?: string;
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
}

// Type for channel info from YouTubeChannelInfoResult
export interface ChannelInfoResult {
  id: string;
  title: string;
  description?: string;
  thumbnails?: {
    default?: { url?: string | null };
    medium?: { url?: string | null };
    high?: { url?: string | null };
  };
  statistics?: {
    subscriberCount?: string;
    videoCount?: string;
    viewCount?: string;
  };
  customUrl?: string | null;
  country?: string | null;
  publishedAt?: string;
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

// YouTube Database Token Types (using generated database types)
export type YouTubeTokensRow = Tables<"youtube_tokens">;
export type YouTubeTokensInsert = TablesInsert<"youtube_tokens">;
export type YouTubeTokensUpdate = TablesUpdate<"youtube_tokens">; 