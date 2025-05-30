/**
 * YouTube OAuth2 Callback Route Handler
 * 
 * This API route handles the OAuth2 callback from Google when users authenticate 
 * their YouTube accounts for artist/account integration.
 * 
 * OAUTH FLOW:
 * 1. User clicks "Connect YouTube Account" button in the UI
 * 2. They are redirected to Google's OAuth2 authorization endpoint
 * 3. User grants permissions to access their YouTube channel
 * 4. Google redirects back to this callback route with authorization code
 * 5. This route exchanges the code for access/refresh tokens
 * 6. Tokens are stored in database linked to the specific account
 * 7. User is redirected back to original page with success/error status
 * 
 * STATE PARAMETER:
 * - Contains JSON with { path: originalPage, account_id: artistAccountId }
 * - Ensures tokens are saved for the correct artist/account
 * - Allows redirect back to the exact page user was on
 * 
 * DATABASE OPERATIONS:
 * - Saves YouTube access/refresh tokens to `youtube_tokens` table
 * - Links tokens to specific account via account_id foreign key
 * - Sets expiration timestamp with 1-minute safety buffer
 * 
 * ERROR HANDLING:
 * - OAuth errors (user denied access, invalid request, etc.)
 * - Missing authorization code from Google
 * - Token exchange failures
 * - Database save errors
 * - Missing account context
 * 
 * REDIRECT BEHAVIOR:
 * - Success: Redirects to original page with ?youtube_auth=success
 * - Error: Redirects to original page with ?youtube_auth_error=<message>
 */

import { NextRequest, NextResponse } from "next/server";
import insertYouTubeTokens from "@/lib/supabase/youtubeTokens/insertYouTubeTokens";
import { createYouTubeOAuthClient } from "@/lib/youtube/oauth-client";

const oauth2Client = createYouTubeOAuthClient();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state"); // Contains JSON with path and account_id

  // Parse state to get account_id and redirect path
  let account_id: string | null = null;
  let redirectPath = "/";

  if (state) {
    try {
      const stateData = JSON.parse(state);
      account_id = stateData.account_id;
      redirectPath = stateData.path || "/";
    } catch (parseError) {
      console.error("Error parsing state parameter:", parseError);
      // Fallback: treat state as just the path (old format)
      redirectPath = state;
    }
  }

  if (error) {
    console.error("YouTube auth error:", error);
    return NextResponse.redirect(
      new URL(
        redirectPath +
          (redirectPath.includes("?") ? "&" : "?") +
          "youtube_auth_error=" +
          encodeURIComponent(error as string),
        request.url
      )
    );
  }

  if (!code) {
    console.error("No authorization code provided");
    return NextResponse.redirect(
      new URL(
        redirectPath +
          (redirectPath.includes("?") ? "&" : "?") +
          "youtube_auth_error=No+code+provided",
        request.url
      )
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

    // Ensure we have account_id from the state parameter
    if (!account_id) {
      console.error("No account_id provided for token storage");
      return NextResponse.redirect(
        new URL(
          redirectPath +
            (redirectPath.includes("?") ? "&" : "?") +
            "youtube_auth_error=No+account+specified",
          request.url
        )
      );
    }

    // Calculate expires_at timestamp
    const expiresAt = tokens.expiry_date
      ? new Date(tokens.expiry_date - 60000).toISOString() // Subtract 1 minute for safety
      : new Date(Date.now() + 3600000).toISOString(); // Default to 1 hour from now

    // Save tokens to database
    const result = await insertYouTubeTokens({
      account_id: account_id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || undefined,
      expires_at: expiresAt,
    });

    if (!result) {
      throw new Error("Failed to save YouTube tokens to database");
    }

    console.log(
      "YouTube tokens saved to database successfully for account:",
      account_id
    );
    console.log("YouTube authentication successful, redirecting...");
    return NextResponse.redirect(
      new URL(
        redirectPath +
          (redirectPath.includes("?") ? "&" : "?") +
          "youtube_auth=success",
        request.url
      )
    );
  } catch (err) {
    console.error("Error in YouTube auth callback:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Error+getting+tokens";
    return NextResponse.redirect(
      new URL(
        redirectPath +
          (redirectPath.includes("?") ? "&" : "?") +
          "youtube_auth_error=" +
          encodeURIComponent(errorMessage),
        request.url
      )
    );
  }
}
