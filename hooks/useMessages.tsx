import { useEffect, useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { useCsrfToken } from "./useCsrfToken";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useParams } from "next/navigation";
import createMemory from "@/lib/createMemory";
import { useUserProvider } from "@/providers/UserProvder";
import getClientMessages from "@/lib/supabase/getClientMessages";
import { useChatSegment } from "./useChatSegment";
import { ChatMessage } from "@/types/reasoning";
import { v4 as uuidv4 } from "uuid";

const useMessages = () => {
  const csrfToken = useCsrfToken();
  const { selectedArtist } = useArtistProvider();
  const params = useParams();
  const chatId =
    typeof params.chat_id === "string" ? params.chat_id : undefined;
  const { userData } = useUserProvider();
  // For /new route, we explicitly set isLoading to false
  const [isLoading, setIsLoading] = useState(!!chatId);
  const { data: segmentData, isError: segmentError } = useChatSegment(chatId);

  // Generate temporary ID for new chats
  const tempId = useMemo(
    () => (!chatId ? `temp-${uuidv4()}` : chatId),
    [chatId]
  );

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
    id: tempId,
    api: `/api/chat`,
    headers: {
      "X-CSRF-Token": csrfToken,
    },
    body: {
      artistId: selectedArtist?.account_id,
      roomId: chatId || tempId,
      segmentId: segmentData?.segmentId,
    },
    onFinish: (message) => {
      if (chatId) {
        createMemory(message as ChatMessage, chatId);
      }
    },
  });

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }
    const fetch = async () => {
      if (!userData?.id) return;
      setIsLoading(true);
      try {
        const initialMessages = await getClientMessages(chatId);
        setMessages(initialMessages as ChatMessage[]);
      } catch (error) {
        console.error("[useMessages] Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [chatId, userData?.id, setMessages]);

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
    messages: messages as ChatMessage[],
    pending: status === "streaming" || status === "submitted",
    isLoading,
  };
};

export default useMessages;
