import generateUUID from "@/lib/generateUUID";

/**
 * Basic message interface for YouTube OAuth continuation
 */
interface OAuthContinuationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

/**
 * Handles YouTube OAuth continuation by checking URL parameters for OAuth results
 * and returning appropriate continuation messages for the chat
 * 
 * @param searchParams - URL search parameters from the page
 * @returns Array of initial messages to continue the conversation, or empty array if no OAuth params
 */
export function getYouTubeOAuthContinuationMessage(
  searchParams?: { [key: string]: string | string[] | undefined }
): OAuthContinuationMessage[] {
  if (!searchParams) {
    return [];
  }

  const youtubeAuth = searchParams.youtube_auth;
  const youtubeAuthError = searchParams.youtube_auth_error;

  // Handle successful YouTube authentication
  if (youtubeAuth === "success") {
    return [
      {
        id: generateUUID(),
        role: "user",
        content: "Great! I've successfully connected my YouTube account. Please continue with what you were helping me with.",
      },
    ];
  }

  // Handle YouTube authentication error
  if (youtubeAuthError) {
    const errorMessage = Array.isArray(youtubeAuthError) ? youtubeAuthError[0] : youtubeAuthError;
    return [
      {
        id: generateUUID(),
        role: "user",
        content: `I encountered an issue while connecting my YouTube account: ${decodeURIComponent(errorMessage)}. Can you help me try connecting again?`,
      },
    ];
  }

  // No OAuth parameters found
  return [];
}