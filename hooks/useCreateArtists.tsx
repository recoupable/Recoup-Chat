import { Message } from "@ai-sdk/react";
import { useCallback, useEffect, useState } from "react";

const useCreateArtists = () => {
  const [isCreatingArtist, setIsCreatingArtist] =
    useState(false);

  // Add chat monitoring state
  const [chatStatus, setChatStatus] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  // Monitor chat for artist creation
  useEffect(() => {
    if (!chatMessages.length) {
      setIsCreatingArtist(false);
      return;
    }

    if (chatMessages.length <= 2) {
      const firstMessage = chatMessages[0]?.content;
      const isCreatingArtist = firstMessage === "create a new artist";

      if (isCreatingArtist && chatStatus) {
        const isInProgress =
          chatStatus === "submitted" || chatStatus === "streaming";
        setIsCreatingArtist(isInProgress);
      } else {
        setIsCreatingArtist(false);
      }
    } else {
      setIsCreatingArtist(false);
    }
  }, [chatStatus, chatMessages]);

  // Function to update chat state from VercelChatProvider
  const updateChatState = useCallback((status: string, messages: Message[]) => {
    setChatStatus(status);
    setChatMessages(messages);
  }, []);

  return {
    setIsCreatingArtist,
    isCreatingArtist,
    updateChatState,
  };
};

export default useCreateArtists;
