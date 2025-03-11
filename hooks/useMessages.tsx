import { useEffect, useState, useCallback, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import type { Message } from "@ai-sdk/react";
import { useCsrfToken } from "./useCsrfToken";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useParams } from "next/navigation";
import createMemory from "@/lib/createMemory";
import { useUserProvider } from "@/providers/UserProvder";
import getInitialMessages from "@/lib/supabase/getInitialMessages";
import { useChatSegment } from "./useChatSegment";

const useMessages = () => {
  const csrfToken = useCsrfToken();
  const { selectedArtist } = useArtistProvider();
  const params = useParams();
  const chatId =
    typeof params.chat_id === "string" ? params.chat_id : undefined;
  const { userData } = useUserProvider();
  const [isLoading, setIsLoading] = useState(false);
  const [initialMessagesLoaded, setInitialMessagesLoaded] = useState(false);
  const { data: segmentData, isError: segmentError } = useChatSegment(chatId);

  // Memoize the chat configuration to prevent unnecessary re-renders
  const chatConfig = useMemo(() => ({
    api: `/api/chat`,
    headers: {
      "X-CSRF-Token": csrfToken,
    },
    body: {
      artistId: selectedArtist?.account_id,
      roomId: chatId,
      segmentId: segmentData?.segmentId,
    },
    onFinish: (message: Message) => {
      if (chatId) {
        createMemory(message, chatId);
      }
      setInput("");
    },
  }), [csrfToken, selectedArtist?.account_id, chatId, segmentData?.segmentId]);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: handleAiChatSubmit,
    append: appendAiChat,
    status,
    setMessages,
    reload: reloadAiChat,
    setInput,
  } = useChat(chatConfig);

  // Create a memoized submit handler to prevent recreating on each render
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    handleAiChatSubmit(e);
    setInput("");
  }, [handleAiChatSubmit, setInput]);

  // Reset messages when chatId changes
  useEffect(() => {
    // Clear messages when navigating to a new chat
    setMessages([]);
    setInitialMessagesLoaded(false);
  }, [chatId, setMessages]);

  // Fetch initial messages only once per chatId
  useEffect(() => {
    const fetch = async () => {
      if (!userData?.id || !chatId || initialMessagesLoaded) return;
      
      setIsLoading(true);
      try {
        const initialMessages = await getInitialMessages(chatId);
        setMessages(initialMessages);
        setInitialMessagesLoaded(true);
      } catch (error) {
        console.error("[useMessages] Error fetching initial messages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetch();
  }, [chatId, userData?.id, setMessages, initialMessagesLoaded]);

  if (segmentError) {
    console.error("[useMessages] Error fetching segment:", segmentError);
  }

  return {
    reloadAiChat,
    appendAiChat,
    handleAiChatSubmit: handleSubmit,
    handleInputChange,
    input,
    setInput,
    setMessages,
    messages,
    pending: status === "streaming" || status === "submitted",
    isLoading,
  };
};

export default useMessages;
