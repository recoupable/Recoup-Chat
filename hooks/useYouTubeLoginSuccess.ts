import { useEffect, useRef } from "react";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useUserProvider } from "@/providers/UserProvder";
import { useVercelChatContext } from "@/providers/VercelChatProvider";
import { generateUUID } from "@/lib/generateUUID";
import { fetchYouTubeTokens } from "@/lib/youtube/fetchYouTubeTokens";

/**
 * Hook that detects YouTube login success and automatically continues the conversation
 * Only triggers when the latest message's final tool call is youtube_login (indicating auth failure)
 * and valid tokens are found in the database (indicating auth success)
 */
export function useYouTubeLoginSuccess() {
  const { selectedArtist } = useArtistProvider();
  const { userData } = useUserProvider();
  const { append, messages } = useVercelChatContext();
  const hasCheckedOAuth = useRef(false);

  useEffect(() => {
    // Only run once
    if (hasCheckedOAuth.current) {
      return;
    }

    // Check if this component is part of the latest message with YouTube tool call
    const latestMessage = messages[messages.length - 1];
    if (!latestMessage || latestMessage.role !== 'assistant') {
      return;
    }

    // Check if the FINAL tool call in the latest message is YouTube (meaning it failed)
    const parts = latestMessage.parts || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toolParts = parts.filter((part: any) => part.type === 'tool-invocation');
    const lastToolPart = toolParts[toolParts.length - 1];
    
    // Type guard to check if it's a tool invocation with the right structure
    const isLastToolYouTube = lastToolPart && 
      'toolInvocation' in lastToolPart && 
      lastToolPart.toolInvocation?.toolName === 'youtube_login';

    if (!isLastToolYouTube) {
      return;
    }

    hasCheckedOAuth.current = true;

    // Check for valid YouTube tokens via API
    if (selectedArtist?.account_id && userData?.id) {
      fetchYouTubeTokens(selectedArtist.account_id, userData.id)
        .then(data => {
          if (data.success && data.hasValidTokens) {
            const successMessage = {
              id: generateUUID(),
              role: "user" as const,
              content: "Great! I've successfully connected my YouTube account. Please continue with what you were helping me with.",
            };
            
            append(successMessage);
          }
        })
        .catch(() => {
          // Silently handle errors - user can retry manually if needed
        });
    }
  }, [selectedArtist?.account_id, userData?.id, messages, append]);
}