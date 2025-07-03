interface YouTubeTokensResponse {
  success: boolean;
  hasValidTokens: boolean;
  tokens?: any;
  error?: string;
}

/**
 * Fetches YouTube tokens for a specific artist account
 * @param artistAccountId - The artist account ID
 * @param accountId - The user account ID
 * @returns Promise with token validation result
 */
export async function fetchYouTubeTokens(
  artistAccountId: string,
  accountId: string
): Promise<YouTubeTokensResponse> {
  const apiUrl = `/api/youtube/tokens?artist_account_id=${encodeURIComponent(artistAccountId)}&account_id=${encodeURIComponent(accountId)}`;
  
  const response = await fetch(apiUrl);
  const data = await response.json();
  
  return data;
}