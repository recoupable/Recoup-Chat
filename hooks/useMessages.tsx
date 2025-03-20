import { useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import type { Message } from "@ai-sdk/react";
import { useCsrfToken } from "./useCsrfToken";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useParams } from "next/navigation";
import createMemory from "@/lib/createMemory";
import { useUserProvider } from "@/providers/UserProvder";
import getClientMessages from "@/lib/supabase/getClientMessages";
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

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: handleAiChatSubmit,
    append: appendAiChat,
    status,
    setMessages,
    reload: reloadAiChat,
  } = useChat({
    id: chatId,
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

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
    }
  }, [chatId, setMessages]);

  useEffect(() => {
    const fetch = async () => {
      if (!userData?.id) return;
      if (!chatId) return;
      setIsLoading(true);
      const initialMessages = await getClientMessages(chatId);
      setMessages(initialMessages);
      setIsLoading(false);
    };
    fetch();
  }, [chatId, userData, setMessages]);

  if (segmentError) {
    console.error("[useMessages] Error fetching segment:", segmentError);
  }

  return {
    reloadAiChat,
    appendAiChat,
    handleAiChatSubmit,
    handleInputChange,
    input,
    setMessages,
    messages,
    pending: status === "streaming" || status === "submitted",
    isLoading,
  };
};

export default useMessages;
