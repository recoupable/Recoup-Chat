import { NextRequest, NextResponse } from "next/server";
import getYouTubeTokens from "@/lib/supabase/youtubeTokens/getYouTubeTokens";
import getAccountArtistIds from "@/lib/supabase/accountArtistIds/getAccountArtistIds";

export async function GET(request: NextRequest) {
  try {
    // Get parameters from query
    const { searchParams } = new URL(request.url);
    const artistAccountId = searchParams.get('artist_account_id');
    const accountId = searchParams.get('account_id');

    if (!artistAccountId) {
      return NextResponse.json(
        { error: "Missing artist_account_id parameter" },
        { status: 400 }
      );
    }

    if (!accountId) {
      return NextResponse.json(
        { error: "Missing account_id parameter" },
        { status: 400 }
      );
    }

    console.log('🔍 YouTube tokens API called for artist:', artistAccountId, 'by account:', accountId);

    // Security: Verify the accountId has access to this artistAccountId
    const accountArtists = await getAccountArtistIds({ accountIds: [accountId] });
    
    // Check if the artistAccountId is in the list of artists this account has access to
    const hasAccess = accountArtists.some((artist: any) => artist.account_id === artistAccountId);
    
    if (!hasAccess) {
      console.log('❌ Authorization failed: Account does not have access to this artist');
      return NextResponse.json(
        { error: "Unauthorized: Account does not have access to this artist" },
        { status: 400 }
      );
    }

    console.log('✅ Authorization verified for account access to artist');

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