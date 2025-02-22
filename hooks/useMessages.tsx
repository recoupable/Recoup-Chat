import { useEffect, useState, useCallback } from "react";
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
import useAnalyzeArtistTool from "./useAnalyzeArtistTool";
import useCreateArtistTool from "./useCreateArtistTool";
import useSpecificReport from "./useSpecificReport";

interface ToolArgs {
  question?: string;
  context?: {
    args?: unknown;
  };
}

const useMessages = () => {
  const csrfToken = useCsrfToken();
  const { selectedArtist } = useArtistProvider();
  const { chatContext } = useChatContext();
  const { chat_id: chatId } = useParams();
  const { userData } = useUserProvider();
  const [isLoading, setIsLoading] = useState(false);
  const specificReportParams = useSpecificReport();

  const analyzeArtist = useAnalyzeArtistTool(null, null, null);
  const createArtist = useCreateArtistTool(null, null, null);

  const handleToolCall = useCallback(
    ({ toolCall }: { toolCall: ToolCall<string, ToolArgs> }) => {
      const { toolName, args } = toolCall;
      const question = args?.question || "";

      if (toolName === "analyzeArtist") {
        return analyzeArtist(toolName, question, args);
      }
      if (toolName === "createArtist") {
        return createArtist(toolName, question, args);
      }
    },
    [analyzeArtist, createArtist]
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
    api: `/api/chat`,
    headers: {
      "X-CSRF-Token": csrfToken,
    },
    body: {
      artistId: selectedArtist?.account_id,
      context: chatContext,
      roomId: chatId,
    },
    onToolCall: handleToolCall,
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
    chatContext,
    isLoading,
  };
};

export default useMessages;
