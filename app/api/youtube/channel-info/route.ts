import { NextRequest, NextResponse } from "next/server";
import { fetchYouTubeChannelInfo } from "@/lib/youtube/channel-fetcher";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token") || undefined;
    const includeBranding = searchParams.get("include_branding") === "true";

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "Missing access_token parameter" },
        { status: 400 }
      );
    }

    const result = await fetchYouTubeChannelInfo({
      accessToken,
      refreshToken,
      includeBranding,
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
