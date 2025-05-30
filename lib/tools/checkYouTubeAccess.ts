import { z } from "zod";
import { tool } from "ai";
import { google } from "googleapis";
import getYouTubeTokens from "@/lib/supabase/youtubeTokens/getYouTubeTokens";
import { YouTubeAccessResult } from "@/types/youtube";

// Zod schema for parameter validation
const schema = z.object({
  artist_ID: z.string().describe("Artist ID to check YouTube access for. This is required as tokens are stored per account.")
});

const checkYouTubeAccessTool = tool({
  description:
    "Check if YouTube access is available for a specific account and return basic channel information. " +
    "This tool verifies if valid YouTube OAuth tokens exist for the account and fetches channel data. " +
    "Returns channel name, picture, subscriber count, and other basic information if authenticated, " +
    "or an error message if authentication is required. " +
    "Requires account_id parameter as each account has their own YouTube tokens.",
  parameters: schema,
  execute: async ({ artist_ID }): Promise<YouTubeAccessResult> => {
    try {
      // Get tokens from database using account_id
      const storedTokens = await getYouTubeTokens(artist_ID);
      
      if (!storedTokens) {
        return {
          success: false,
          status: "error",
          message: "No YouTube tokens found for this account. Please authenticate with YouTube first by visiting the OAuth authorization URL."
        };
      }

      // Check if token has expired (with 1-minute safety buffer)
      const now = Date.now();
      const expiresAt = new Date(storedTokens.expires_at).getTime();
      if (now > (expiresAt - 60000)) {
        return {
          success: false,
          status: "error",
          message: "YouTube access token has expired for this account. Please re-authenticate by visiting the OAuth authorization URL."
        };
      }

      // Set up OAuth2 client with stored tokens
      const oauth2Client = new google.auth.OAuth2(
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`
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

      // Fetch channel information
      const response = await youtube.channels.list({
        part: ["snippet", "statistics"],
        mine: true,
      });

      if (!response.data.items || response.data.items.length === 0) {
        return {
          success: false,
          status: "error",
          message: "No YouTube channels found for this authenticated account"
        };
      }

      const channelData = response.data.items[0];
      
      return {
        success: true,
        status: "success",
        message: "YouTube access verified successfully for account",
        channelInfo: {
          id: channelData.id || "",
          name: channelData.snippet?.title || "",
          thumbnails: {
            default: channelData.snippet?.thumbnails?.default?.url || null,
            medium: channelData.snippet?.thumbnails?.medium?.url || null,
            high: channelData.snippet?.thumbnails?.high?.url || null,
          },
          subscriberCount: channelData.statistics?.subscriberCount || "0",
          videoCount: channelData.statistics?.videoCount || "0",
          viewCount: channelData.statistics?.viewCount || "0",
          customUrl: channelData.snippet?.customUrl || null,
          country: channelData.snippet?.country || null,
          publishedAt: channelData.snippet?.publishedAt || null,
        }
      };
    } catch (error: unknown) {
      console.error("Error checking YouTube access:", error);
      
      // If token is invalid/expired, return appropriate error
      if (error && typeof error === 'object' && 'code' in error && error.code === 401) {
        return {
          success: false,
          status: "error",
          message: "YouTube authentication is invalid or has expired for this account. Please re-authenticate by visiting the OAuth authorization URL."
        };
      }
      
      return {
        success: false,
        status: "error",
        message: error instanceof Error ? error.message : "Failed to check YouTube access for this account. Please ensure the account is authenticated with YouTube."
      };
    }
  },
});

export default checkYouTubeAccessTool; 