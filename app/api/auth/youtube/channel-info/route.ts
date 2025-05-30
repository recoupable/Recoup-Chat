import { NextRequest, NextResponse } from "next/server";
import { YouTubeChannelInfo } from "@/types/youtube";
import { createYouTubeAPIClient } from "@/lib/youtube/oauth-client";
import { validateYouTubeTokens } from "@/lib/youtube/token-validator";

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

    // Validate YouTube tokens
    const tokenValidation = await validateYouTubeTokens(account_id);
    if (!tokenValidation.success) {
      return NextResponse.json({
        success: false,
        status: "error",
        message: tokenValidation.error!.message
      });
    }

    // Create YouTube API client with validated tokens
    const youtube = createYouTubeAPIClient(
      tokenValidation.tokens!.access_token,
      tokenValidation.tokens!.refresh_token ?? undefined
    );

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