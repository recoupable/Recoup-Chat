import { useCsrfToken } from "@/packages/shared/src/hooks";
import { Message, useChat as useAiChat } from "ai/react";
import { useQueryClient } from "@tanstack/react-query";
import trackNewMessage from "@/lib/stack/trackNewMessage";
import { Address } from "viem";
import { usePrivy } from "@privy-io/react-auth";
import useInitialMessages from "./useInitialMessages";
import { useEffect, useState } from "react";
import { SUGGESTIONS } from "@/lib/consts";

const useChat = () => {
  const { login, user } = usePrivy();
  const address = user?.wallet?.address as Address;
  const csrfToken = useCsrfToken();
  const accountId = "3664dcb4-164f-4566-8e7c-20b2c93f9951";
  const queryClient = useQueryClient();
  const { initialMessages } = useInitialMessages();
  const [suggestions, setSuggestions] = useState(SUGGESTIONS);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: handleAiChatSubmit,
    append: appendAiChat,
    isLoading: pending,
  } = useAiChat({
    api: `/api/chat`,
    headers: {
      "X-CSRF-Token": csrfToken,
    },
    body: {
      accountId,
      address,
    },
    initialMessages,
    onError: console.error,
    onFinish: () => {
      void queryClient.invalidateQueries({
        queryKey: ["credits", accountId],
      });
    },
  });

  const isPrepared = () => {
    if (!address) {
      login();
      return false;
    }
    return true;
  };

  const append = async (message: Message) => {
    if (!isPrepared()) return;
    await trackNewMessage(address as Address, message);
    await appendAiChat(message);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isPrepared()) return;
    handleAiChatSubmit(e);
    await trackNewMessage(address as Address, {
      content: input,
      role: "user",
      id: `${address}-${Date.now().toLocaleString()}`,
    });
  };

  useEffect(() => {
    const init = async () => {
      const lastAnswer = messages.filter(
        (message) => message.role === "assistant",
      )?.[0]?.content;
      const response = await fetch(`/api/prompts?answer=${lastAnswer}`);
      const data = await response.json();

      setSuggestions(data.questions);
    };

    if (!messages.length || pending) return;
    init();
  }, [messages, pending]);

  return {
    suggestions,
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    pending,
  };
};

export default useChat;
