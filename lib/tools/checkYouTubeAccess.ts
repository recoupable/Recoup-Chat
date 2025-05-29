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

// Interface for YouTube channel response
interface YouTubeChannelInfo {
  success: boolean;
  status: string;
  message?: string;
  channel?: {
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
    };
    customUrl?: string | null;
    country?: string | null;
    publishedAt: string;
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

const checkYouTubeAccessTool = tool({
  description:
    "Check if we have valid YouTube channel access credentials and return channel information if authenticated. " +
    "This tool validates stored YouTube tokens and fetches basic channel information including name, picture, subscriber count, etc.",
  parameters: schema,
  execute: async (): Promise<YouTubeChannelInfo> => {
    try {
      const storedTokens = await getTokensFromFile();
      
      if (!storedTokens) {
        return {
          success: false,
          status: "error",
          message: "No valid YouTube tokens found. Please authenticate first."
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

      // Fetch channel information
      const response = await youtube.channels.list({
        part: ["snippet", "statistics"],
        mine: true,
      });

      if (!response.data.items || response.data.items.length === 0) {
        return {
          success: false,
          status: "error",
          message: "No YouTube channels found for this account"
        };
      }

      const channelData = response.data.items[0];
      
      return {
        success: true,
        status: "success",
        message: "YouTube channel access verified successfully",
        channel: {
          id: channelData.id || "",
          title: channelData.snippet?.title || "",
          description: channelData.snippet?.description || "",
          thumbnails: {
            default: channelData.snippet?.thumbnails?.default ? { url: channelData.snippet.thumbnails.default.url } : undefined,
            medium: channelData.snippet?.thumbnails?.medium ? { url: channelData.snippet.thumbnails.medium.url } : undefined,
            high: channelData.snippet?.thumbnails?.high ? { url: channelData.snippet.thumbnails.high.url } : undefined,
          },
          statistics: {
            subscriberCount: channelData.statistics?.subscriberCount || "0",
            videoCount: channelData.statistics?.videoCount || "0",
            viewCount: channelData.statistics?.viewCount || "0",
          },
          customUrl: channelData.snippet?.customUrl,
          country: channelData.snippet?.country,
          publishedAt: channelData.snippet?.publishedAt || "",
        }
      };
    } catch (error: unknown) {
      console.error("Error checking YouTube access:", error);
      
      // If token is invalid/expired, return appropriate error
      if (error && typeof error === 'object' && 'code' in error && error.code === 401) {
        return {
          success: false,
          status: "error",
          message: "YouTube authentication failed. Please sign in again."
        };
      }
      
      return {
        success: false,
        status: "error",
        message: error instanceof Error ? error.message : "Failed to check YouTube channel access"
      };
    }
  },
});

export default checkYouTubeAccessTool; 