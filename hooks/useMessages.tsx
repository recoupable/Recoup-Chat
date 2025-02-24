import { useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import type { Message } from "@ai-sdk/react";
import { useCsrfToken } from "./useCsrfToken";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useParams } from "next/navigation";
import createMemory from "@/lib/createMemory";
import { useUserProvider } from "@/providers/UserProvder";
import getInitialMessages from "@/lib/supabase/getInitialMessages";

const useMessages = () => {
  const csrfToken = useCsrfToken();
  const { selectedArtist } = useArtistProvider();
  const { chat_id: chatId } = useParams();
  const { userData } = useUserProvider();
  const [isLoading, setIsLoading] = useState(false);

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
    api: `/api/chat`,
    headers: {
      "X-CSRF-Token": csrfToken,
    },
    body: {
      artistId: selectedArtist?.account_id,
      roomId: chatId,
    },
    onFinish: (message: Message) => {
      createMemory(message, chatId as string, selectedArtist?.account_id || "");
    },
  });

  useEffect(() => {
    const fetch = async () => {
      if (!userData?.id) return;
      if (!chatId) return;
      setIsLoading(true);
      const initialMessages = await getInitialMessages(chatId as string);
      setMessages(initialMessages);
      setIsLoading(false);
    };
    fetch();
  }, [chatId, userData, setMessages]);

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
