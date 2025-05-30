/**
 * YouTube Channel Data Mapping Utilities
 * 
 * Provides reusable functions to transform raw YouTube channel info objects
 * into standardized channel data structures, eliminating code duplication.
 */

import { 
  YouTubeChannelData, 
  RawChannelInfo, 
  ChannelInfoResult 
} from "@/types/youtube";

// Union type for thumbnail formats
type ThumbnailSource = {
  default?: string | { url?: string | null } | null;
  medium?: string | { url?: string | null } | null;
  high?: string | { url?: string | null } | null;
} | undefined;

// Union type for sources that might have statistics in different formats
type StatisticsSource = {
  subscriberCount?: string;
  videoCount?: string;
  viewCount?: string;
  statistics?: {
    subscriberCount?: string;
    videoCount?: string;
    viewCount?: string;
  };
};

// Union type for base channel data sources
type BaseChannelSource = {
  id?: string;
  name?: string;
  title?: string;
  description?: string;
  customUrl?: string | null;
  country?: string | null;
  publishedAt?: string | null;
};

/**
 * Helper function to normalize thumbnails from various formats to standardized format
 */
function normalizeThumbnails(thumbnails: ThumbnailSource) {
  if (!thumbnails) {
    return {
      default: { url: null },
      medium: { url: null },
      high: { url: null },
    };
  }

  // Handle flat thumbnail format (string URLs)
  if (typeof thumbnails.default === 'string' || thumbnails.default === null) {
    return {
      default: { url: thumbnails.default || null },
      medium: { url: (thumbnails.medium as string) || null },
      high: { url: (thumbnails.high as string) || null },
    };
  }

  // Handle nested thumbnail format (objects with url property)
  return {
    default: { url: (thumbnails.default as { url?: string | null })?.url || null },
    medium: { url: (thumbnails.medium as { url?: string | null })?.url || null },
    high: { url: (thumbnails.high as { url?: string | null })?.url || null },
  };
}

/**
 * Helper function to normalize statistics from various formats
 */
function normalizeStatistics(source: StatisticsSource) {
  return {
    subscriberCount: source.subscriberCount || source.statistics?.subscriberCount || "0",
    videoCount: source.videoCount || source.statistics?.videoCount || "0",
    viewCount: source.viewCount || source.statistics?.viewCount || "0",
  };
}

/**
 * Helper function to create base channel data structure
 */
function createBaseChannelData(source: BaseChannelSource): Omit<YouTubeChannelData, 'statistics' | 'thumbnails'> {
  return {
    id: source.id || "",
    title: source.name || source.title || "",
    description: source.description || "",
    customUrl: source.customUrl || null,
    country: source.country || null,
    publishedAt: source.publishedAt || "",
  };
}

/**
 * Maps raw channel info from YouTubeAccessResult.channelInfo to YouTubeChannelData
 * @param info - Raw channel info object from various sources
 * @returns Standardized YouTubeChannelData object
 */
export function mapRawChannelInfoToChannelData(info: RawChannelInfo): YouTubeChannelData {
  return {
    ...createBaseChannelData(info),
    thumbnails: normalizeThumbnails(info.thumbnails),
    statistics: normalizeStatistics(info),
  };
}

/**
 * Maps YouTubeChannelInfoResult.channelInfo to YouTubeAccessResult.channelInfo format
 * This handles the conversion between different result formats for backward compatibility
 * @param channelInfo - Channel info from YouTubeChannelInfoResult
 * @returns Channel info in YouTubeAccessResult format
 */
export function mapChannelInfoResultToAccessResult(channelInfo: ChannelInfoResult) {
  const stats = normalizeStatistics(channelInfo);
  const thumbnails = normalizeThumbnails(channelInfo.thumbnails);
  
  return {
    id: channelInfo.id,
    name: channelInfo.title, // Map title to name for compatibility
    thumbnails: {
      default: thumbnails.default.url,
      medium: thumbnails.medium.url,
      high: thumbnails.high.url,
    },
    subscriberCount: stats.subscriberCount,
    videoCount: stats.videoCount,
    viewCount: stats.viewCount,
    customUrl: channelInfo.customUrl,
    country: channelInfo.country,
    publishedAt: channelInfo.publishedAt,
  };
}

/**
 * Maps YouTubeChannelData to API response channel format
 * Used in API routes to standardize the response structure
 * @param channel - YouTubeChannelData from channel fetcher
 * @returns Channel object for API response
 */
export function mapChannelDataToAPIResponse(channel: YouTubeChannelData) {
  const { statistics, ...baseChannel } = channel;
  
  return {
    ...baseChannel,
    statistics: {
      subscriberCount: statistics.subscriberCount,
      videoCount: statistics.videoCount,
      viewCount: statistics.viewCount,
    },
  };
} 