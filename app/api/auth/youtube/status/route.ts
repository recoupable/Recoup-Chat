import { NextRequest, NextResponse } from "next/server";
import getYouTubeTokens from "@/lib/supabase/youtubeTokens/getYouTubeTokens";

interface YouTubeStatusResponse {
  authenticated: boolean;
  message: string;
  expiresAt?: string;
  createdAt?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<YouTubeStatusResponse>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const artist_id = searchParams.get("artist_id");

    if (!artist_id) {
      return NextResponse.json({
        authenticated: false,
        message: "Artist ID is required to check YouTube authentication status"
      });
    }

    // Get tokens from database
    const storedTokens = await getYouTubeTokens(artist_id);
    
    if (!storedTokens) {
      return NextResponse.json({
        authenticated: false,
        message: "No YouTube tokens found for this artist. Please authenticate first."
      });
    }

    // Check if token has expired (with 1-minute safety buffer)
    const now = Date.now();
    const expiresAt = new Date(storedTokens.expires_at).getTime();
    if (now > (expiresAt - 60000)) {
      return NextResponse.json({
        authenticated: false,
        message: "YouTube access token has expired for this artist. Please re-authenticate."
      });
    }

    return NextResponse.json({
      authenticated: true,
      message: "YouTube authentication is valid for this artist",
      expiresAt: storedTokens.expires_at,
      createdAt: storedTokens.created_at
    });
  } catch (error) {
    console.error("Error checking YouTube auth status:", error);
    
    return NextResponse.json({
      authenticated: false,
      message: "Failed to check YouTube authentication status"
    });
  }
} 