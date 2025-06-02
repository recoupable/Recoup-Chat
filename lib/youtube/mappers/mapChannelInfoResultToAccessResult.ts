/**
 * Maps YouTubeChannelInfoResult.channelInfo to YouTubeAccessResult.channelInfo format
 * This handles the conversion between different result formats for backward compatibility
 */

import { ChannelInfoResult } from "@/types/youtube";
import { normalizeStatistics } from "./normalizeStatistics";
import normalizeThumbnails from "./normalizeThumbnails";

export function mapChannelInfoResultToAccessResult(
  channelInfo: ChannelInfoResult
) {
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
