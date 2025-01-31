import { useEffect, useRef, useState } from "react";
import { Message, useChat as useAiChat } from "ai/react";
import { useCsrfToken } from "@/packages/shared/src/hooks";
import { useParams, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useUserProvider } from "@/providers/UserProvder";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useConversationsProvider } from "@/providers/ConverstaionsProvider";
import { useInitialMessagesProvider } from "@/providers/InititalMessagesProvider";
import trackNewMessage from "@/lib/stack/trackNewMessage";
import { Address } from "viem";
import formattedContent from "@/lib/formattedContent";
import { usePromptsProvider } from "@/providers/PromptsProvider";
import useFunnels from "./useFunnels";

const useMessages = () => {
  const { currentQuestion, setCurrentQuestion } = usePromptsProvider();
  const csrfToken = useCsrfToken();
  const { initialMessages } = useInitialMessagesProvider();
  const { conversationRef } = useConversationsProvider();
  const queryClient = useQueryClient();
  const { email, address } = useUserProvider();
  const [toolCall, setToolCall] = useState<any>(null);
  const { selectedArtist } = useArtistProvider();
  const { conversation: pathId } = useParams();
  const { funnelContext, setFunnelContext } = useFunnels();
  const searchParams = useSearchParams();
  const active_analaysis_id = searchParams.get("active_analaysis_id");

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: handleAiChatSubmit,
    append: appendAiChat,
    isLoading: pending,
    setMessages,
  } = useAiChat({
    api: `/api/chat`,
    headers: {
      "X-CSRF-Token": csrfToken,
    },
    body: {
      email,
      artistId: selectedArtist?.artist_id || "",
      context: funnelContext || "",
      active_analaysis_id: active_analaysis_id || "",
    },
    initialMessages,
    onToolCall: ({ toolCall }) => {
      setToolCall(toolCall as any);
    },
    onFinish: async (message) => {
      setToolCall(null);
      await finalCallback(
        message,
        messagesRef.current[messagesRef.current.length - 2],
        conversationRef.current,
      );
      void queryClient.invalidateQueries({
        queryKey: ["credits", email],
      });
    },
  });

  const messagesRef = useRef(messages);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const finalCallback = async (
    message: Message,
    lastQuestion?: Message,
    newConversationId?: string,
    referenceId?: string,
  ) => {
    const convId = newConversationId || (pathId as string);
    const question = lastQuestion || currentQuestion;
    if (!message.content || !question) return;
    await trackNewMessage(
      address as Address,
      question,
      selectedArtist?.artist_id || "",
      convId,
    );
    await trackNewMessage(
      address as Address,
      {
        ...message,
        content: formattedContent(message.content),
        questionId: question.id,
      },
      selectedArtist?.artist_id || "",
      convId,
      referenceId,
    );
    setCurrentQuestion(null);
  };

  return {
    appendAiChat,
    handleAiChatSubmit,
    handleInputChange,
    input,
    setMessages,
    messages,
    messagesRef,
    pending,
    toolCall,
    finalCallback,
    setFunnelContext,
  };
};

export default useMessages;
