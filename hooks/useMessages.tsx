import { useEffect, useRef, useState } from "react";
import useSuggestions from "./useSuggestions";
import { useChat as useAiChat } from "ai/react";
import { useCsrfToken } from "@/packages/shared/src/hooks";
import useInitialMessages from "./useInitialMessages";
import useConversations from "./useConversations";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useUserProvider } from "@/providers/UserProvder";
import { useArtistProvider } from "@/providers/ArtistProvider";

const useMessages = () => {
  const { finalCallback } = useSuggestions();
  const csrfToken = useCsrfToken();
  const { initialMessages, fetchInitialMessages } = useInitialMessages();
  const { conversationRef } = useConversations();
  const queryClient = useQueryClient();
  const { email } = useUserProvider();
  const [toolCall, setToolCall] = useState<any>(null);
  const { selectedArtist, artistActive } = useArtistProvider();

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
  };
};

export default useMessages;
