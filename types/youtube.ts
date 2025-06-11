// YouTube API Response Types

import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/database.types";

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
    code: "NO_CHANNELS" | "API_ERROR";
    message: string;
  };
}

// YouTube Mapping Types (from channel-mapper.ts)
// Union type for thumbnail formats used in channel data mapping
export type ThumbnailSource =
  | {
      default?: string | { url?: string | null } | null;
      medium?: string | { url?: string | null } | null;
      high?: string | { url?: string | null } | null;
    }
  | undefined;

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
    code:
      | "NO_TOKENS"
      | "EXPIRED"
      | "FETCH_ERROR"
      | "REFRESH_INCOMPLETE_CREDENTIALS"
      | "REFRESH_GENERAL_FAILURE"
      | "DB_UPDATE_FAILED"
      | "REFRESH_INVALID_GRANT"
      | "EXPIRED_NO_REFRESH";
    message: string;
  };
}

// Component Props Types
export interface YouTubeChannelDisplayProps {
  channel: YouTubeChannelData;
  name: string;
  isLive?: boolean;
}

export interface YouTubeErrorDisplayProps {
  name: string;
  errorMessage: string;
  onLogin: () => void;
  isLive?: boolean;
}

// YouTube Database Token Types (using generated database types)
export type YouTubeTokensRow = Tables<"youtube_tokens">;
export type YouTubeTokensInsert = TablesInsert<"youtube_tokens">;
export type YouTubeTokensUpdate = TablesUpdate<"youtube_tokens">;

// Error response types for different contexts
export interface ToolErrorResponse {
  success: false;
  status: "error";
  message: string;
}

export interface AuthStatusErrorResponse {
  authenticated: false;
  message: string;
}

export interface APIErrorResponse {
  success: false;
  status: "error";
  message: string;
}

export interface UtilityErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

// Success response types
export interface ToolSuccessResponse {
  success: true;
  status: "success";
  message: string;
  [key: string]: unknown;
}

export interface AuthStatusSuccessResponse {
  authenticated: true;
  message: string;
  expiresAt?: string;
  createdAt?: string;
}

export interface APISuccessResponse {
  success: true;
  status: "success";
  message: string;
  [key: string]: unknown;
}

export interface UtilitySuccessResponse {
  success: true;
  [key: string]: unknown;
}

// Monetization Check Types
export interface MonetizationCheckResult {
  success: boolean;
  isMonetized?: boolean;
  error?: {
    code:
      | "NO_TOKENS"
      | "EXPIRED"
      | "FETCH_ERROR"
      | "INSUFFICIENT_SCOPE"
      | "ANALYTICS_ERROR"
      | "CHANNEL_NOT_FOUND"
      | "API_ERROR";
    message: string;
  };
}

export interface MonetizationAnalyticsData {
  channelId: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  estimatedRevenue?: number;
  hasRevenueData: boolean;
}

// Result interface for revenue data
export interface YouTubeRevenueResult {
  success: boolean;
  status: string;
  message?: string;
  revenueData?: {
    totalRevenue: number;
    dailyRevenue: Array<{
      date: string;
      revenue: number;
    }>;
    dateRange: {
      startDate: string;
      endDate: string;
    };
    channelId: string;
    isMonetized: boolean;
  };
}

// Types
export interface TokenValidation {
  success: boolean;
  tokens?: {
    access_token: string;
    account_id: string;
    created_at: string;
    expires_at: string;
    id: string;
    refresh_token: string | null;
    updated_at: string;
  };
  error?: { message: string };
}

export interface AnalyticsReportsResult {
  dailyRevenue: { date: string; revenue: number }[];
  totalRevenue: number;
  channelId: string;
}
