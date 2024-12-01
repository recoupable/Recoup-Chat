import { useEffect, useRef, useState } from "react";
import usePrompts from "./usePrompts";
import { useChat as useAiChat } from "ai/react";
import { useCsrfToken } from "@/packages/shared/src/hooks";
import useInitialMessages from "./useInitialMessages";
import useConversations from "./useConversations";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useUserProvider } from "@/providers/UserProvder";
import { useArtistProvider } from "@/providers/ArtistProvider";
import useAiTitle from "./useAiTitle";

const useMessages = () => {
  const csrfToken = useCsrfToken();
  const { initialMessages, fetchInitialMessages, initialTitle } =
    useInitialMessages();
  const { conversationRef } = useConversations();
  const queryClient = useQueryClient();
  const { email } = useUserProvider();
  const [toolCall, setToolCall] = useState<any>(null);
  const { selectedArtist, artistActive } = useArtistProvider();
  const { finalCallback, suggestions, setCurrentQuestion } = usePrompts();
  const pathname = usePathname();
  const isNewChat = pathname === "/";
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
      artistId: artistActive ? selectedArtist?.id : "",
    },
    initialMessages,
    onError: console.error,
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
  const { title } = useAiTitle(messages);

  const messagesRef = useRef(messages);

  useEffect(() => {
    if (messages.length) messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (initialMessages.length) setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    if (isNewChat) {
      conversationRef.current = "";
      setMessages([]);
    }
  }, [isNewChat]);

  return {
    conversationRef,
    appendAiChat,
    handleAiChatSubmit,
    handleInputChange,
    input,
    messagesRef,
    pending,
    fetchInitialMessages,
    toolCall,
    suggestions,
    setCurrentQuestion,
    finalCallback,
    title: initialTitle || title,
  };
};

export default useMessages;
