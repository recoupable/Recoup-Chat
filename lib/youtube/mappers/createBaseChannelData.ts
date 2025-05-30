/**
 * Create base channel data structure
 */

import { RawChannelInfo, YouTubeChannelData } from "@/types/youtube";

function createBaseChannelData(source: RawChannelInfo): Omit<YouTubeChannelData, 'statistics' | 'thumbnails'> {
  return {
    id: source.id || "",
    title: source.name || source.title || "",
    description: source.description || "",
    customUrl: source.customUrl || null,
    country: source.country || null,
    publishedAt: source.publishedAt || "",
  };
}

export default createBaseChannelData;