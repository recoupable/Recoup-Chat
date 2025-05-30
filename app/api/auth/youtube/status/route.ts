import { NextRequest, NextResponse } from "next/server";
import { YouTubeStatusResponse } from "@/types/youtube";
import { validateYouTubeTokens } from "@/lib/youtube/token-validator";
import { YouTubeErrorBuilder, YouTubeErrorMessages } from "@/lib/youtube/error-builder";

export async function GET(request: NextRequest): Promise<NextResponse<YouTubeStatusResponse>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const account_id = searchParams.get("account_id");

    if (!account_id) {
      return NextResponse.json(
        YouTubeErrorBuilder.createAuthStatusError(YouTubeErrorMessages.NO_ACCOUNT_ID + " to check YouTube authentication status")
      );
    }

    // Validate YouTube tokens
    const tokenValidation = await validateYouTubeTokens(account_id);
    if (!tokenValidation.success) {
      return NextResponse.json(
        YouTubeErrorBuilder.createAuthStatusError(tokenValidation.error!.message)
      );
    }

    return NextResponse.json(
      YouTubeErrorBuilder.createAuthStatusSuccess(
        "YouTube authentication is valid for this account",
        tokenValidation.tokens!.expires_at,
        tokenValidation.tokens!.created_at
      )
    );
  } catch (error) {
    console.error("Error checking YouTube auth status:", error);
    
    return NextResponse.json(
      YouTubeErrorBuilder.createAuthStatusError(YouTubeErrorMessages.STATUS_CHECK_FAILED)
    );
  }
} 