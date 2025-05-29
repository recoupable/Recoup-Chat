import { z } from "zod";
import { tool } from "ai";
import { google } from "googleapis";
import getYouTubeTokens from "@/lib/supabase/youtubeTokens/getYouTubeTokens";

// Interface for YouTube channel information response
interface YouTubeChannelInfoResult {
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

// Zod schema for parameter validation
const schema = z.object({
  artist_id: z.string().describe("Artist ID to get YouTube channel information for. This is required as tokens are stored per artist.")
});

const getYouTubeChannelInfoTool = tool({
  description:
    "Get detailed YouTube channel information for a specific artist including subscribers, views, videos count, and other channel statistics. " +
    "This tool requires the artist to be authenticated with YouTube first. " +
    "Use the check_youtube_access tool first to ensure the artist is authenticated. " +
    "Returns comprehensive channel data including basic info, statistics, thumbnails, and branding settings. " +
    "Requires artist_id parameter as each artist has their own YouTube channel and tokens.",
  parameters: schema,
  execute: async ({ artist_id }): Promise<YouTubeChannelInfoResult> => {
    try {
      // Get tokens from database using artist_id
      const storedTokens = await getYouTubeTokens(artist_id);
      
      if (!storedTokens) {
        return {
          success: false,
          status: "error",
          message: "No YouTube tokens found for this artist. Please authenticate with YouTube first by using the check_youtube_access tool and following the authentication instructions."
        };
      }

      // Check if token has expired (with 1-minute safety buffer)
      const now = Date.now();
      const expiresAt = new Date(storedTokens.expires_at).getTime();
      if (now > (expiresAt - 60000)) {
        return {
          success: false,
          status: "error",
          message: "YouTube access token has expired for this artist. Please re-authenticate by using the check_youtube_access tool and following the authentication instructions."
        };
      }

      // Set up OAuth2 client with stored tokens
      const oauth2Client = new google.auth.OAuth2(
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/youtube/callback`
      );

      oauth2Client.setCredentials({
        access_token: storedTokens.access_token,
        refresh_token: storedTokens.refresh_token ?? undefined,
      });

      // Create YouTube API client
      const youtube = google.youtube({
        version: "v3",
        auth: oauth2Client,
      });

      // Fetch comprehensive channel information
      const response = await youtube.channels.list({
        part: ["snippet", "statistics", "brandingSettings", "status"],
        mine: true,
      });

      if (!response.data.items || response.data.items.length === 0) {
        return {
          success: false,
          status: "error",
          message: "No YouTube channels found for this authenticated artist"
        };
      }

      const channelData = response.data.items[0];
      
      return {
        success: true,
        status: "success",
        message: "YouTube channel information retrieved successfully for artist",
        channelInfo: {
          // Basic channel information
          id: channelData.id || "",
          title: channelData.snippet?.title || "",
          description: channelData.snippet?.description || "",
          customUrl: channelData.snippet?.customUrl || null,
          country: channelData.snippet?.country || null,
          publishedAt: channelData.snippet?.publishedAt || "",
          
          // Channel thumbnails
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
          
          // Channel statistics
          statistics: {
            subscriberCount: channelData.statistics?.subscriberCount || "0",
            videoCount: channelData.statistics?.videoCount || "0",
            viewCount: channelData.statistics?.viewCount || "0",
            hiddenSubscriberCount: channelData.statistics?.hiddenSubscriberCount === true,
          },
          
          // Channel branding
          branding: {
            keywords: channelData.brandingSettings?.channel?.keywords || null,
            defaultLanguage: channelData.brandingSettings?.channel?.defaultLanguage || null,
          },
          
          // Authentication metadata
          authentication: {
            tokenCreatedAt: storedTokens.created_at,
            tokenExpiresAt: storedTokens.expires_at,
          },
        }
      };
    } catch (error: unknown) {
      console.error("Error getting YouTube channel info:", error);
      
      // If token is invalid/expired, return appropriate error
      if (error && typeof error === 'object' && 'code' in error && error.code === 401) {
        return {
          success: false,
          status: "error",
          message: "YouTube authentication is invalid or has expired for this artist. Please re-authenticate by using the check_youtube_access tool and following the authentication instructions."
        };
      }
      
      return {
        success: false,
        status: "error",
        message: error instanceof Error ? error.message : "Failed to get YouTube channel information for this artist. Please ensure the artist is authenticated with YouTube."
      };
    }
  },
});

export default getYouTubeChannelInfoTool; 