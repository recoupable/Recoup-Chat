import { z } from "zod";
import { tool } from "ai";
import { google } from "googleapis";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// Interface for stored YouTube tokens
interface StoredTokens {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
  created_at: number;
}

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
    
    // Channel branding/settings
    branding?: {
      keywords?: string;
      defaultLanguage?: string;
    };
    
    // Additional metadata
    metadata: {
      authenticatedAt: string;
      tokenExpiresAt: string;
    };
  };
}

const TOKENS_DIR = path.join(process.cwd(), 'data');
const TOKENS_FILE = path.join(TOKENS_DIR, 'youtube-tokens.json');

async function getTokensFromFile(): Promise<StoredTokens | null> {
  try {
    if (!existsSync(TOKENS_FILE)) {
      console.log('No YouTube tokens file found');
      return null;
    }

    const fileContent = await readFile(TOKENS_FILE, 'utf8');
    const tokens: StoredTokens = JSON.parse(fileContent);
    
    // Check if token has expired
    if (Date.now() > tokens.expires_at) {
      console.log('YouTube access token has expired');
      return null;
    }
    
    return tokens;
  } catch (error) {
    console.error('Error reading YouTube tokens from file:', error);
    return null;
  }
}

// Zod schema for parameter validation (no parameters needed for this tool)
const schema = z.object({});

const getYouTubeChannelInfoTool = tool({
  description:
    "Get detailed YouTube channel information including subscriber count, video count, view count, and other channel statistics. " +
    "📝 IMPORTANT: You must authenticate with YouTube first by calling the 'check_youtube_access' tool to verify access before using this tool. " +
    "This tool will return comprehensive channel data including: " +
    "- Channel statistics (subscribers, videos, views) " +
    "- Channel metadata (name, description, country) " +
    "- Channel thumbnails and branding information " +
    "- Authentication status and token expiry information. " +
    "If not authenticated, it will return an error message prompting for YouTube login.",
  parameters: schema,
  execute: async (): Promise<YouTubeChannelInfoResult> => {
    try {
      const storedTokens = await getTokensFromFile();
      
      if (!storedTokens) {
        return {
          success: false,
          status: "error",
          message: "No valid YouTube tokens found. Please authenticate with YouTube first by calling the 'check_youtube_access' tool and following the login instructions."
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
        refresh_token: storedTokens.refresh_token,
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
          message: "No YouTube channels found for this authenticated account"
        };
      }

      const channelData = response.data.items[0];
      
      return {
        success: true,
        status: "success",
        message: "YouTube channel information retrieved successfully",
        channelInfo: {
          // Basic information
          id: channelData.id || "",
          title: channelData.snippet?.title || "",
          description: channelData.snippet?.description || "",
          customUrl: channelData.snippet?.customUrl,
          country: channelData.snippet?.country,
          publishedAt: channelData.snippet?.publishedAt || "",
          
          // Thumbnails
          thumbnails: {
            default: channelData.snippet?.thumbnails?.default ? { url: channelData.snippet.thumbnails.default.url } : undefined,
            medium: channelData.snippet?.thumbnails?.medium ? { url: channelData.snippet.thumbnails.medium.url } : undefined,
            high: channelData.snippet?.thumbnails?.high ? { url: channelData.snippet.thumbnails.high.url } : undefined,
          },
          
          // Statistics
          statistics: {
            subscriberCount: channelData.statistics?.subscriberCount || "0",
            videoCount: channelData.statistics?.videoCount || "0",
            viewCount: channelData.statistics?.viewCount || "0",
            hiddenSubscriberCount: channelData.statistics?.hiddenSubscriberCount || false,
          },
          
          // Branding information
          branding: {
            keywords: channelData.brandingSettings?.channel?.keywords || undefined,
            defaultLanguage: channelData.snippet?.defaultLanguage || undefined,
          },
          
          // Metadata
          metadata: {
            authenticatedAt: new Date(storedTokens.created_at).toISOString(),
            tokenExpiresAt: new Date(storedTokens.expires_at).toISOString(),
          },
        }
      };
    } catch (error: unknown) {
      console.error("Error fetching YouTube channel info:", error);
      
      // If token is invalid/expired, return appropriate error
      if (error && typeof error === 'object' && 'code' in error && error.code === 401) {
        return {
          success: false,
          status: "error",
          message: "YouTube authentication has expired or is invalid. Please re-authenticate by calling the 'check_youtube_access' tool and following the login instructions."
        };
      }
      
      return {
        success: false,
        status: "error",
        message: error instanceof Error ? error.message : "Failed to fetch YouTube channel information. Please ensure you are authenticated with YouTube."
      };
    }
  },
});

export default getYouTubeChannelInfoTool; 