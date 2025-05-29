import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import insertYouTubeTokens from "@/lib/supabase/youtubeTokens/insertYouTubeTokens";

const oauth2Client = new google.auth.OAuth2(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/youtube/callback` // Must match Google Console
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state"); // Contains original path and artist_id
  const artist_id = searchParams.get("artist_id"); // Direct artist_id parameter

  if (error) {
    console.error("YouTube auth error:", error);
    const redirectPath = state || "/";
    return NextResponse.redirect(
      new URL(redirectPath + (redirectPath.includes("?") ? "&" : "?") + "youtube_auth_error=" + encodeURIComponent(error as string), request.url)
    );
  }

  if (!code) {
    console.error("No authorization code provided");
    const redirectPath = state || "/";
    return NextResponse.redirect(
      new URL(redirectPath + (redirectPath.includes("?") ? "&" : "?") + "youtube_auth_error=No+code+provided", request.url)
    );
  }

  try {
    console.log("Exchanging authorization code for tokens...");
    const { tokens } = await oauth2Client.getToken(code);
    console.log("Tokens received:", {
      hasAccessToken: !!tokens.access_token,
      hasRefreshToken: !!tokens.refresh_token,
      expiryDate: tokens.expiry_date,
    });

    if (!tokens.access_token) {
      throw new Error("No access token received from YouTube");
    }

    // Get artist_id from URL parameters
    if (!artist_id) {
      console.error("No artist_id provided for token storage");
      const redirectPath = state || "/";
      return NextResponse.redirect(
        new URL(redirectPath + (redirectPath.includes("?") ? "&" : "?") + "youtube_auth_error=No+artist+specified", request.url)
      );
    }

    // Calculate expires_at timestamp
    const expiresAt = tokens.expiry_date 
      ? new Date(tokens.expiry_date - 60000).toISOString() // Subtract 1 minute for safety
      : new Date(Date.now() + 3600000).toISOString(); // Default to 1 hour from now

    // Save tokens to database
    const result = await insertYouTubeTokens({
      artist_id: artist_id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || undefined,
      expires_at: expiresAt,
    });

    if (!result) {
      throw new Error("Failed to save YouTube tokens to database");
    }

    console.log("YouTube tokens saved to database successfully for artist:", artist_id);
    console.log("YouTube authentication successful, redirecting...");
    const redirectPath = state || "/";
    return NextResponse.redirect(
      new URL(redirectPath + (redirectPath.includes("?") ? "&" : "?") + "youtube_auth=success", request.url)
    );
  } catch (err) {
    console.error("Error in YouTube auth callback:", err);
    const errorMessage = err instanceof Error ? err.message : "Error+getting+tokens";
    const redirectPath = state || "/";
    return NextResponse.redirect(
      new URL(redirectPath + (redirectPath.includes("?") ? "&" : "?") + "youtube_auth_error=" + encodeURIComponent(errorMessage), request.url)
    );
  }
} 