import { useRef, useState } from "react";
import { Message, useChat as useAiChat } from "ai/react";
import { useCsrfToken } from "@/packages/shared/src/hooks";
import { useParams } from "next/navigation";
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
  const { funnelContext } = useFunnels();

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
      artistId: selectedArtist?.id || "",
      funnelContext,
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
      selectedArtist?.id || "",
      convId,
    );
    await trackNewMessage(
      address as Address,
      {
        ...message,
        content: formattedContent(message.content),
        questionId: question.id,
      },
      selectedArtist?.id || "",
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
  };
};

export default useMessages;
