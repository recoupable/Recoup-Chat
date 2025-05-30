/**
 * Normalize thumbnails from various formats to standardized format
 */

import { ThumbnailSource } from "@/types/youtube";

export function normalizeThumbnails(thumbnails: ThumbnailSource) {
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