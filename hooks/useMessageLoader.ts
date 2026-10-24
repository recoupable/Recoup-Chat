import { useState, useEffect } from "react";
import { UIMessage } from "ai";
import { usePrivy } from "@privy-io/react-auth";
import { getChatMessages } from "@/lib/messages/getChatMessages";

/**
 * Loads persisted UI messages for a session-scoped chat from recoup-api.
 */
export function useMessageLoader(
  sessionId: string | undefined,
  chatId: string | undefined,
  userId: string | undefined,
  setMessages: (messages: UIMessage[]) => void,
  /** Opt-in coordinated resume: called only after a successful current load, including empty history. */
  onLoaded?: () => void,
) {
  const { getAccessToken } = usePrivy();
  const [isLoading, setIsLoading] = useState(!!chatId);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    if (!chatId || !sessionId) {
      setIsLoading(false);
      return;
    }

    if (!userId) {
      setIsLoading(true);
      return;
    }

    const loadMessages = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const accessToken = await getAccessToken();
        if (!accessToken) return;

        const initialMessages = await getChatMessages(
          sessionId,
          chatId,
          accessToken,
          onLoaded ? { requireSuccess: true } : undefined,
        );
        // The coordinated path must never publish a superseded request. The
        // default caller keeps its existing load/update behavior.
        if (onLoaded && !active) return;
        if (initialMessages.length > 0 || onLoaded) {
          setMessages(initialMessages);
        }
        onLoaded?.();
      } catch (err) {
        if (onLoaded && !active) return;
        console.error("Error loading messages:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to load messages"),
        );
      } finally {
        if (!onLoaded || active) setIsLoading(false);
      }
    };

    loadMessages();
    return () => {
      active = false;
    };
  }, [userId, sessionId, chatId, getAccessToken, setMessages, onLoaded]);

  return {
    isLoading,
    error,
    hasError: !!error,
  };
}
