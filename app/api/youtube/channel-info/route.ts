import { NextRequest, NextResponse } from "next/server";
import { fetchYouTubeChannelInfo } from "@/lib/youtube/channel-fetcher";
import { validateYouTubeTokens } from "@/lib/youtube/token-validator";
import getAccountArtistIds from "@/lib/supabase/accountArtistIds/getAccountArtistIds";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const artistAccountId = searchParams.get("artistAccountId");
    const accountId = searchParams.get("accountId");

    if (!artistAccountId || !accountId) {
      return NextResponse.json(
        { success: false, error: "Missing artistAccountId or accountId parameter" },
        { status: 400 }
      );
    }

    // Security: Verify the accountId has access to this artistAccountId
    const accountArtists = await getAccountArtistIds({ accountIds: [accountId] });
    const hasAccess = accountArtists.some((artist: any) => artist.account_id === artistAccountId);
    if (!hasAccess) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: User does not have access to this artist" },
        { status: 403 }
      );
    }

    // Validate and get tokens server-side
    const tokenResult = await validateYouTubeTokens(artistAccountId);
    if (!tokenResult.success || !tokenResult.tokens?.access_token) {
      return NextResponse.json({ success: false, error: "No valid tokens" }, { status: 401 });
    }

    // Fetch channel info using tokens
    const result = await fetchYouTubeChannelInfo({
      accessToken: tokenResult.tokens.access_token,
      refreshToken: tokenResult.tokens.refresh_token || undefined,
      includeBranding: true,
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
