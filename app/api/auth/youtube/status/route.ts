import { NextRequest, NextResponse } from "next/server";
import { YouTubeStatusResponse } from "@/types/youtube";
import { validateYouTubeTokens } from "@/lib/youtube/token-validator";

export async function GET(request: NextRequest): Promise<NextResponse<YouTubeStatusResponse>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const account_id = searchParams.get("account_id");

    if (!account_id) {
      return NextResponse.json({
        authenticated: false,
        message: "Account ID is required to check YouTube authentication status"
      });
    }

    // Validate YouTube tokens
    const tokenValidation = await validateYouTubeTokens(account_id);
    if (!tokenValidation.success) {
      return NextResponse.json({
        authenticated: false,
        message: tokenValidation.error!.message
      });
    }

    return NextResponse.json({
      authenticated: true,
      message: "YouTube authentication is valid for this account",
      expiresAt: tokenValidation.tokens!.expires_at,
      createdAt: tokenValidation.tokens!.created_at
    });
  } catch (error) {
    console.error("Error checking YouTube auth status:", error);
    
    return NextResponse.json({
      authenticated: false,
      message: "Failed to check YouTube authentication status"
    });
  }
} 