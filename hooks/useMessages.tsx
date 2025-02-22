import { useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import type { Message } from "@ai-sdk/react";
import type { ToolCall } from "ai";
import { useCsrfToken } from "./useCsrfToken";
import { useArtistProvider } from "@/providers/ArtistProvider";
import useChatContext from "./useChatContext";
import { useParams } from "next/navigation";
import createMemory from "@/lib/createMemory";
import { useUserProvider } from "@/providers/UserProvder";
import getInitialMessages from "@/lib/supabase/getInitialMessages";

type ChatToolCall = ToolCall<string, unknown>;

const useMessages = () => {
  const csrfToken = useCsrfToken();
  const [toolCall, setToolCall] = useState<ChatToolCall | null>(null);
  const { selectedArtist } = useArtistProvider();
  const { chatContext } = useChatContext();
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
      context: chatContext,
      roomId: chatId,
    },
    onToolCall: ({ toolCall }: { toolCall: ChatToolCall }) => {
      setToolCall(toolCall);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, userData]);

  return {
    reloadAiChat,
    appendAiChat,
    handleAiChatSubmit,
    handleInputChange,
    input,
    setMessages,
    messages,
    pending: status === "streaming" || status === "submitted",
    toolCall,
    chatContext,
    isLoading,
  };
};

export default useMessages;
