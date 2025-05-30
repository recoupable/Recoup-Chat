/**
 * Normalize result to YouTubeAccessResult format
 */

import { YouTubeAccessResult, YouTubeChannelInfoResult } from "@/types/youtube";
import { isChannelInfoResult } from "./isChannelInfoResult";
import { mapChannelInfoResultToAccessResult } from "./mapChannelInfoResultToAccessResult";

export function normalizeResult(result: YouTubeAccessResult | YouTubeChannelInfoResult): YouTubeAccessResult {
  if (isChannelInfoResult(result)) {
    return {
      success: result.success,
      status: result.status,
      message: result.message,
      channelInfo: mapChannelInfoResultToAccessResult(result.channelInfo!)
    };
  }
  
  return result as YouTubeAccessResult;
} 