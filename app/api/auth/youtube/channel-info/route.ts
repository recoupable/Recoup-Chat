/**
 * YouTube Channel Information API Route
 * 
 * Fetches authenticated YouTube channel data for a specific account.
 * 
 * REQUIRES: 
 * - account_id query parameter
 * - Valid YouTube tokens in database for the account
 * 
 * RETURNS:
 * - Channel details (title, thumbnails, statistics, etc.)
 * - Error if not authenticated or account not found
 */

import { NextRequest, NextResponse } from "next/server";
import { YouTubeChannelInfo } from "@/types/youtube";
import { validateYouTubeTokens } from "@/lib/youtube/token-validator";
import { fetchYouTubeChannelInfo } from "@/lib/youtube/channel-fetcher";
import { YouTubeErrorBuilder, YouTubeErrorMessages } from "@/lib/youtube/error-builder";

export async function GET(request: NextRequest): Promise<NextResponse<YouTubeChannelInfo>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const account_id = searchParams.get("account_id");

    if (!account_id) {
      return YouTubeErrorBuilder.createAPIError(YouTubeErrorMessages.NO_ACCOUNT_ID + " to get YouTube channel information");
    }

    // Validate YouTube tokens
    const tokenValidation = await validateYouTubeTokens(account_id);
    if (!tokenValidation.success) {
      return YouTubeErrorBuilder.createAPIError(tokenValidation.error!.message);
    }

    // Fetch channel information using utility
    const channelResult = await fetchYouTubeChannelInfo(tokenValidation.tokens!);
    if (!channelResult.success) {
      return YouTubeErrorBuilder.createAPIError(channelResult.error!.message);
    }

    const channel = channelResult.channelData!;
    
    return YouTubeErrorBuilder.createAPISuccess("YouTube channel access verified successfully for account", {
      channel: {
        id: channel.id,
        title: channel.title,
        description: channel.description,
        thumbnails: channel.thumbnails,
        statistics: {
          subscriberCount: channel.statistics.subscriberCount,
          videoCount: channel.statistics.videoCount,
          viewCount: channel.statistics.viewCount,
        },
        customUrl: channel.customUrl,
        country: channel.country,
        publishedAt: channel.publishedAt,
      }
    });
  } catch (error: unknown) {
    console.error("Error fetching YouTube channel info:", error);
    
    // If token is invalid/expired, return appropriate error
    if (error && typeof error === 'object' && 'code' in error && error.code === 401) {
      return YouTubeErrorBuilder.createAPIError(YouTubeErrorMessages.AUTH_FAILED + " for this account. Please sign in again.");
    }
    
    return YouTubeErrorBuilder.createAPIError(
      error instanceof Error ? error.message : "Failed to fetch YouTube channel information for this account"
    );
  }
} 