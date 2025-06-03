import getYouTubeTokens from "@/lib/supabase/youtubeTokens/getYouTubeTokens";
import { YouTubeTokenValidationResult } from "@/types/youtube";
import { YouTubeErrorBuilder, YouTubeErrorMessages } from "@/lib/youtube/error-builder";
import { refreshYouTubeToken } from "@/lib/youtube/token-refresher";
import { isTokenExpired } from "@/lib/youtube/is-token-expired";

/**
 * Validates YouTube tokens for a given account
 * Checks if tokens exist and haven't expired (with 1-minute safety buffer).
 * Attempts to refresh the token if it's expired and a refresh token is available.
 * 
 * @param account_id - The account ID to validate tokens for
 * @returns Promise with validation result including tokens or error details
 */
export async function validateYouTubeTokens(account_id: string): Promise<YouTubeTokenValidationResult> {
  try {
    // Get tokens from database
    const storedTokens = await getYouTubeTokens(account_id);
    
    if (!storedTokens) {
      return YouTubeErrorBuilder.createUtilityError('NO_TOKENS', YouTubeErrorMessages.NO_TOKENS);
    }

    // Check if token has expired or is about to expire
    if (isTokenExpired(storedTokens.expires_at)) {
      // Token is expired or about to expire, try to refresh
      if (storedTokens.refresh_token) {
        // Attempt token refresh using dedicated refresh module
        const refreshResult = await refreshYouTubeToken(
          storedTokens,
          account_id
        );

        if (refreshResult.success) {
          return {
            success: true,
            tokens: refreshResult.tokens!,
          };
        } else {
          // Return the specific refresh error
          return refreshResult;
        }
      } else {
        // Expired and no refresh token available
        return YouTubeErrorBuilder.createUtilityError(
          "EXPIRED_NO_REFRESH",
          YouTubeErrorMessages.EXPIRED_TOKENS_NO_REFRESH
        );
    }
    }

    // Token is valid and not expired
    return {
      success: true,
      tokens: storedTokens
    };
  } catch (error) {
    console.error('Error validating YouTube tokens:', error);
    return YouTubeErrorBuilder.createUtilityError('FETCH_ERROR', YouTubeErrorMessages.FETCH_ERROR);
  }
} 