import { createYouTubeAPIClient } from "@/lib/youtube/oauth-client";
import { YouTubeTokensRow } from "@/types/youtube";
import { YouTubeErrorBuilder, YouTubeErrorMessages } from "@/lib/youtube/error-builder";

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

/**
 * Fetches YouTube channel information using authenticated tokens
 * @param tokens - Valid YouTube tokens
 * @param includeBranding - Whether to include branding information (optional, defaults to false)
 * @returns Promise with channel data or error details
 */
export async function fetchYouTubeChannelInfo(
  tokens: YouTubeTokensRow, 
  includeBranding: boolean = false
): Promise<YouTubeChannelFetchResult> {
  try {
    // Create YouTube API client with tokens
    const youtube = createYouTubeAPIClient(
      tokens.access_token,
      tokens.refresh_token ?? undefined
    );

    // Determine which parts to fetch based on requirements
    const parts = ["snippet", "statistics"];
    if (includeBranding) {
      parts.push("brandingSettings", "status");
    }

    // Fetch channel information
    const response = await youtube.channels.list({
      part: parts,
      mine: true,
    });

    if (!response.data.items || response.data.items.length === 0) {
      return YouTubeErrorBuilder.createUtilityError('NO_CHANNELS', YouTubeErrorMessages.NO_CHANNELS);
    }

    const channelData = response.data.items[0];
    
    const result: YouTubeChannelData = {
      id: channelData.id || "",
      title: channelData.snippet?.title || "",
      description: channelData.snippet?.description || "",
      thumbnails: {
        default: {
          url: channelData.snippet?.thumbnails?.default?.url || null,
        },
        medium: {
          url: channelData.snippet?.thumbnails?.medium?.url || null,
        },
        high: {
          url: channelData.snippet?.thumbnails?.high?.url || null,
        },
      },
      statistics: {
        subscriberCount: channelData.statistics?.subscriberCount || "0",
        videoCount: channelData.statistics?.videoCount || "0",
        viewCount: channelData.statistics?.viewCount || "0",
        hiddenSubscriberCount: channelData.statistics?.hiddenSubscriberCount === true,
      },
      customUrl: channelData.snippet?.customUrl || null,
      country: channelData.snippet?.country || null,
      publishedAt: channelData.snippet?.publishedAt || "",
    };

    // Add branding info if requested
    if (includeBranding) {
      result.branding = {
        keywords: channelData.brandingSettings?.channel?.keywords || null,
        defaultLanguage: channelData.brandingSettings?.channel?.defaultLanguage || null,
      };
    }

    return {
      success: true,
      channelData: result
    };
  } catch (error: unknown) {
    console.error("Error fetching YouTube channel info:", error);
    
    // If token is invalid/expired, return appropriate error
    if (error && typeof error === 'object' && 'code' in error && error.code === 401) {
      return YouTubeErrorBuilder.createUtilityError('API_ERROR', YouTubeErrorMessages.AUTH_FAILED);
    }
    
    return YouTubeErrorBuilder.createUtilityError('API_ERROR', 
      error instanceof Error ? error.message : YouTubeErrorMessages.API_ERROR
    );
  }
} 