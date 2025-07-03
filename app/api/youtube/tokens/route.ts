import { NextRequest, NextResponse } from "next/server";
import getYouTubeTokens from "@/lib/supabase/youtubeTokens/getYouTubeTokens";

export async function GET(request: NextRequest) {
  try {
    // Security: Only allow requests from the same domain
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    const referer = request.headers.get('referer');
    
    // Check if request is coming from same domain
    const allowedOrigins = [
      `https://${host}`,
      `http://${host}`,
      process.env.NEXT_PUBLIC_URL
    ].filter(Boolean);
    
    if (origin && !allowedOrigins.includes(origin)) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid origin" },
        { status: 403 }
      );
    }
    
    // Also check referer as additional security
    if (referer) {
      const isValidReferer = allowedOrigins.some(allowed => referer.startsWith(allowed));
      if (!isValidReferer) {
        return NextResponse.json(
          { error: "Unauthorized: Invalid referer" },
          { status: 403 }
        );
      }
    }

    // Get artist_account_id from query parameters
    const { searchParams } = new URL(request.url);
    const artistAccountId = searchParams.get('artist_account_id');

    if (!artistAccountId) {
      return NextResponse.json(
        { error: "Missing artist_account_id parameter" },
        { status: 400 }
      );
    }

    console.log('🔍 YouTube tokens API called for artist:', artistAccountId);

    // Call the server-side function
    const tokens = await getYouTubeTokens(artistAccountId);
    
    console.log('🔗 YouTube tokens result:', { hasTokens: !!tokens });

    // Return the tokens (they will be null if not found)
    return NextResponse.json({
      success: true,
      tokens: tokens,
      hasValidTokens: !!(tokens && tokens.access_token)
    });

  } catch (error) {
    console.error('❌ Error in YouTube tokens API:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch YouTube tokens",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}