/**
 * Type guard to check if result is YouTubeChannelInfoResult format
 */

import { YouTubeAccessResult, YouTubeChannelInfoResult } from "@/types/youtube";

export function isChannelInfoResult(result: YouTubeAccessResult | YouTubeChannelInfoResult): result is YouTubeChannelInfoResult {
  return 'channelInfo' in result && result.channelInfo !== undefined && 'title' in result.channelInfo;
} 