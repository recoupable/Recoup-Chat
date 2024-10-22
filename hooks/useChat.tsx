import { useCsrfToken } from "@/packages/shared/src/hooks";
import { Message, useChat as useAiChat } from "ai/react";
import { useQueryClient } from "@tanstack/react-query";
import useInitialMessages from "./useInitialMessages";
import { v4 as uuidV4 } from "uuid";
import useUser from "./useUser";
import useSuggestions from "./useSuggestions";
import { useEffect, useRef } from "react";

const useChat = () => {
  const { login, address } = useUser();
  const csrfToken = useCsrfToken();
  const accountId = "3664dcb4-164f-4566-8e7c-20b2c93f9951";
  const queryClient = useQueryClient();
  const { initialMessages, fetchInitialMessages } = useInitialMessages();
  const { finalCallback, suggestions, setCurrentQuestion } = useSuggestions();

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
      accountId,
    },
    initialMessages,
    onError: console.error,
    onFinish: async (message) => {
      await finalCallback(
        message,
        messagesRef.current[messagesRef.current.length - 2],
      );
      void queryClient.invalidateQueries({
        queryKey: ["credits", accountId],
      });
    },
  });

  const messagesRef = useRef(messages);

  useEffect(() => {
    if (messages.length) messagesRef.current = messages;
  }, [messages]);

  const clearQuery = async () => {
    const messages = await fetchInitialMessages(address);
    setMessages(messages);
  };

  const isPrepared = () => {
    if (!address) {
      login();
      return false;
    }
    return true;
  };

  const append = async (message: Message) => {
    if (!isPrepared()) return;
    setCurrentQuestion(message);
    await appendAiChat(message);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isPrepared()) return;
    setCurrentQuestion({
      content: input,
      role: "user",
      id: uuidV4(),
    });
    handleAiChatSubmit(e);
  };

  return {
    suggestions,
    messages: messagesRef.current,
    input,
    handleInputChange,
    handleSubmit,
    append,
    pending,
    finalCallback,
    clearQuery,
  };
};

export default useChat;
