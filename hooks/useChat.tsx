import { useCsrfToken } from "@/packages/shared/src/hooks";
import { Message, useChat as useAiChat } from "ai/react";
import { useQueryClient } from "@tanstack/react-query";
import trackNewMessage from "@/lib/stack/trackNewMessage";
import { Address } from "viem";
import { usePrivy } from "@privy-io/react-auth";
import useInitialMessages from "./useInitialMessages";

const useChat = () => {
  const { login, user } = usePrivy();
  const address = user?.wallet?.address as Address;
  const csrfToken = useCsrfToken();
  const accountId = "3664dcb4-164f-4566-8e7c-20b2c93f9951";
  const queryClient = useQueryClient();
  const { initialMessages } = useInitialMessages();

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

  return { messages, input, handleInputChange, handleSubmit, append, pending };
};

export default useChat;
