import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// Path to stored tokens
const TOKENS_DIR = path.join(process.cwd(), "data");
const TOKENS_FILE = path.join(TOKENS_DIR, "youtube-tokens.json");

interface StoredTokens {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
  created_at: number;
}

interface YouTubeStatusResponse {
  authenticated: boolean;
  message: string;
  expiresAt?: number;
  createdAt?: number;
}

async function checkTokensFromFile(): Promise<StoredTokens | null> {
  try {
    if (!existsSync(TOKENS_FILE)) {
      console.log('No YouTube tokens file found');
      return null;
    }

    const fileContent = await readFile(TOKENS_FILE, 'utf8');
    const tokens: StoredTokens = JSON.parse(fileContent);
    
    // Check if token has expired
    if (Date.now() > tokens.expires_at) {
      console.log('YouTube access token has expired');
      return null;
    }
    
    return tokens;
  } catch (error) {
    console.error('Error reading YouTube tokens from file:', error);
    return null;
  }
}

export async function GET(): Promise<NextResponse<YouTubeStatusResponse>> {
  try {
    const storedTokens = await checkTokensFromFile();
    
    if (!storedTokens) {
      return NextResponse.json({
        authenticated: false,
        message: "No valid YouTube tokens found. Please authenticate first."
      });
    }

    return NextResponse.json({
      authenticated: true,
      message: "YouTube authentication is valid",
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