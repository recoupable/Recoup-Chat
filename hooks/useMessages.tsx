import { useEffect, useState } from "react";
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
  const { data: segmentData, isError: segmentError } = useChatSegment(chatId);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);

  const {
    messages: aiMessages,
    input,
    handleInputChange,
    handleSubmit: baseHandleSubmit,
    append: appendAiChat,
    status,
    setMessages: setAiMessages,
    reload: reloadAiChat,
    setInput,
  } = useChat({
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
    },
  });

  // Load initial messages when chat or artist changes
  useEffect(() => {
    const fetch = async () => {
      if (!userData?.id || !chatId || !selectedArtist?.account_id) return;
      
      setIsLoading(true);
      try {
        const initialMessages = await getInitialMessages(chatId, selectedArtist.account_id);
        if (initialMessages?.length) {
          setLocalMessages(initialMessages);
          setAiMessages(initialMessages);
        }
      } catch (error) {
        console.error("[useMessages] Error fetching initial messages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetch();
  }, [chatId, userData?.id, selectedArtist?.account_id, setAiMessages]);

  // Keep local messages in sync with AI messages
  useEffect(() => {
    if (aiMessages?.length) {
      setLocalMessages(aiMessages);
    }
  }, [aiMessages]);

  const handleAiChatSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentInput = input.trim();
    if (!currentInput) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentInput,
      role: "user",
    };
    
    // Update both message states
    const newMessages = [...localMessages, userMessage];
    setLocalMessages(newMessages);
    setAiMessages(newMessages);
    
    try {
      // Submit first, then clear input
      await baseHandleSubmit(e);
      setInput("");
    } catch (error) {
      console.error("[handleAiChatSubmit] Error:", error);
    }
  };

  if (segmentError) {
    console.error("[useMessages] Error fetching segment:", segmentError);
  }

  return {
    reloadAiChat,
    appendAiChat,
    handleAiChatSubmit,
    handleInputChange,
    input,
    setMessages: setLocalMessages,
    messages: localMessages,
    pending: status === "streaming" || status === "submitted",
    isLoading,
  };
};

export default useMessages;
