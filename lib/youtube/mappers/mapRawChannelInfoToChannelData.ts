/**
 * Maps raw channel info from YouTubeAccessResult.channelInfo to YouTubeChannelData
 */

import { RawChannelInfo, YouTubeChannelData } from "@/types/youtube";
import { createBaseChannelData } from "./createBaseChannelData";
import { normalizeThumbnails } from "./normalizeThumbnails";
import { normalizeStatistics } from "./normalizeStatistics";

export function mapRawChannelInfoToChannelData(info: RawChannelInfo): YouTubeChannelData {
  return {
    ...createBaseChannelData(info),
    thumbnails: normalizeThumbnails(info.thumbnails),
    statistics: normalizeStatistics(info),
  };
} 