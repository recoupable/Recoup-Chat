import getYouTubeTokens from "@/lib/supabase/youtubeTokens/getYouTubeTokens";
import { YouTubeTokensRow } from "@/types/youtube";

export interface YouTubeTokenValidationResult {
  success: boolean;
  tokens?: YouTubeTokensRow;
  error?: {
    code: 'NO_TOKENS' | 'EXPIRED' | 'FETCH_ERROR';
    message: string;
  };
}

/**
 * Validates YouTube tokens for a given account
 * Checks if tokens exist and haven't expired (with 1-minute safety buffer)
 * 
 * @param account_id - The account ID to validate tokens for
 * @returns Promise with validation result including tokens or error details
 */
export async function validateYouTubeTokens(account_id: string): Promise<YouTubeTokenValidationResult> {
  try {
    // Get tokens from database
    const storedTokens = await getYouTubeTokens(account_id);
    
    if (!storedTokens) {
      return {
        success: false,
        error: {
          code: 'NO_TOKENS',
          message: 'No YouTube tokens found for this account. Please authenticate first.'
        }
      };
    }

    // Check if token has expired (with 1-minute safety buffer)
    const now = Date.now();
    const expiresAt = new Date(storedTokens.expires_at).getTime();
    if (now > (expiresAt - 60000)) {
      return {
        success: false,
        error: {
          code: 'EXPIRED',
          message: 'YouTube access token has expired for this account. Please re-authenticate.'
        }
      };
    }

    return {
      success: true,
      tokens: storedTokens
    };
  } catch (error) {
    console.error('Error validating YouTube tokens:', error);
    return {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to validate YouTube tokens. Please try again.'
      }
    };
  }
} 