import { useState, useEffect } from "react";
import { Message } from "ai";
import getClientMessages from "@/lib/supabase/getClientMessages";

/**
 * Hook for loading existing messages from a room
 * @param roomId - The room ID to load messages from (undefined to skip loading)
 * @param userId - The current user ID (messages won't load if user is not authenticated)
 * @param setMessages - Callback function to set the loaded messages
 * @returns Loading state and error information
 */
export function useMessageLoader(
  roomId: string | undefined,
  userId: string | undefined,
  setMessages: (messages: Message[]) => void
) {
  const [isLoading, setIsLoading] = useState(!!roomId);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!roomId || !userId) {
      setIsLoading(false);
      return;
    }

    const loadMessages = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const initialMessages = await getClientMessages(roomId);
        if (initialMessages.length > 0) {
          setMessages(initialMessages as Message[]);
        }
      } catch (err) {
        console.error("Error loading messages:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to load messages")
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [roomId, userId, setMessages]);

  return {
    isLoading,
    error,
    hasError: !!error,
  };
}
