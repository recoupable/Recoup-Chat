/**
 * YouTube Authentication Status API Route
 * 
 * Checks if an account has valid YouTube authentication tokens.
 * 
 * REQUIRES: 
 * - account_id query parameter
 * 
 * RETURNS:
 * - Authentication status (true/false)
 * - Token expiry and creation timestamps if authenticated
 * - Error message if tokens invalid/expired
 */

import { NextRequest, NextResponse } from "next/server";
import { YouTubeStatusResponse } from "@/types/youtube";
import { validateYouTubeTokens } from "@/lib/youtube/token-validator";
import { YouTubeErrorBuilder, YouTubeErrorMessages } from "@/lib/youtube/error-builder";

export async function GET(request: NextRequest): Promise<NextResponse<YouTubeStatusResponse>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const account_id = searchParams.get("account_id");

    if (!account_id) {
      const error = YouTubeErrorBuilder.createAuthStatusError(YouTubeErrorMessages.NO_ACCOUNT_ID + " to check YouTube authentication status");
      return NextResponse.json(error);
    }

    // Validate YouTube tokens
    const tokenValidation = await validateYouTubeTokens(account_id);
    
    if (!tokenValidation.success) {
      const error = YouTubeErrorBuilder.createAuthStatusError(tokenValidation.error!.message);
      return NextResponse.json(error);
    }

    const success = YouTubeErrorBuilder.createAuthStatusSuccess(
      "YouTube authentication is valid for this account",
      tokenValidation.tokens!.expires_at,
      tokenValidation.tokens!.created_at
    );
    return NextResponse.json(success);
  } catch (error) {
    console.error("YouTube status API error:", error);
    
    const errorResponse = YouTubeErrorBuilder.createAuthStatusError(YouTubeErrorMessages.STATUS_CHECK_FAILED);
    return NextResponse.json(errorResponse);
  }
} 