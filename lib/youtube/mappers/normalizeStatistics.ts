/**
 * Normalize statistics from various formats
 */

import { StatisticsSource } from "@/types/youtube";

export function normalizeStatistics(source: StatisticsSource) {
  return {
    subscriberCount: source.subscriberCount || source.statistics?.subscriberCount || "0",
    videoCount: source.videoCount || source.statistics?.videoCount || "0",
    viewCount: source.viewCount || source.statistics?.viewCount || "0",
  };
} 