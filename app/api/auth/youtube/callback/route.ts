import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const oauth2Client = new google.auth.OAuth2(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/youtube/callback` // Must match Google Console
);

// Path to store tokens
const TOKENS_DIR = path.join(process.cwd(), "data");
const TOKENS_FILE = path.join(TOKENS_DIR, "youtube-tokens.json");

interface StoredTokens {
  access_token: string;
  refresh_token?: string;
  expires_at: number; // Unix timestamp when access token expires
  created_at: number; // Unix timestamp when tokens were created
}

async function ensureDataDirectory() {
  if (!existsSync(TOKENS_DIR)) {
    await mkdir(TOKENS_DIR, { recursive: true });
  }
}

async function saveTokensToFile(tokens: {
  access_token?: string | null;
  refresh_token?: string | null;
  expiry_date?: number | null;
}) {
  await ensureDataDirectory();

  const expiresAt = tokens.expiry_date
    ? tokens.expiry_date - 60000 // Subtract 1 minute for safety
    : Date.now() + 3600 * 1000; // Default 1 hour

  const storedTokens: StoredTokens = {
    access_token: tokens.access_token || "",
    refresh_token: tokens.refresh_token || undefined,
    expires_at: expiresAt,
    created_at: Date.now(),
  };

  console.log("Token file path:", TOKENS_FILE);
  await writeFile(TOKENS_FILE, JSON.stringify(storedTokens, null, 2), "utf8");
  console.log("Tokens saved successfully to file");
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state"); // Original path to redirect back to

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

    // Save tokens to file
    await saveTokensToFile(tokens);

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