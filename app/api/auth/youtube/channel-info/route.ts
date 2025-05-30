import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import getYouTubeTokens from "@/lib/supabase/youtubeTokens/getYouTubeTokens";

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

export async function GET(request: NextRequest): Promise<NextResponse<YouTubeChannelInfo>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const account_id = searchParams.get("account_id");

    if (!account_id) {
      return NextResponse.json({
        success: false,
        status: "error",
        message: "Account ID is required to get YouTube channel information"
      });
    }

    // Get tokens from database
    const storedTokens = await getYouTubeTokens(account_id);
    
    if (!storedTokens) {
      return NextResponse.json({
        success: false,
        status: "error",
        message: "No YouTube tokens found for this account. Please authenticate first."
      });
    }

    // Check if token has expired (with 1-minute safety buffer)
    const now = Date.now();
    const expiresAt = new Date(storedTokens.expires_at).getTime();
    if (now > (expiresAt - 60000)) {
      return NextResponse.json({
        success: false,
        status: "error",
        message: "YouTube access token has expired for this account. Please re-authenticate."
      });
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
      return NextResponse.json({
        success: false,
        status: "error",
        message: "No YouTube channels found for this authenticated account"
      });
    }

    const channelData = response.data.items[0];
    
    return NextResponse.json({
      success: true,
      status: "success",
      message: "YouTube channel access verified successfully for account",
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
        customUrl: channelData.snippet?.customUrl || null,
        country: channelData.snippet?.country || null,
        publishedAt: channelData.snippet?.publishedAt || "",
      }
    });
  } catch (error: unknown) {
    console.error("Error fetching YouTube channel info:", error);
    
    // If token is invalid/expired, return appropriate error
    if (error && typeof error === 'object' && 'code' in error && error.code === 401) {
      return NextResponse.json({
        success: false,
        status: "error",
        message: "YouTube authentication failed for this account. Please sign in again."
      });
    }
    
    return NextResponse.json({
      success: false,
      status: "error",
      message: error instanceof Error ? error.message : "Failed to fetch YouTube channel information for this account"
    });
  }
} 