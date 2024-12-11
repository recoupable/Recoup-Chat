import { Message } from "ai/react";
import { v4 as uuidV4 } from "uuid";
import { useRouter, useSearchParams } from "next/navigation";
import useMessages from "./useMessages";
import { useUserProvider } from "@/providers/UserProvder";
import { useConversationsProvider } from "@/providers/ConverstaionsProvider";
import getAiTitle from "@/lib/getAiTitle";
import { useState } from "react";

const useChat = () => {
  const { login, address } = useUserProvider();
  const { push } = useRouter();
  const { conversationId, trackNewTitle } = useConversationsProvider();
  const searchParams = useSearchParams();
  const reportEnabled = searchParams.get("report");
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  const {
    conversationRef,
    input,
    appendAiChat,
    handleAiChatSubmit,
    handleInputChange,
    messagesRef,
    pending,
    fetchInitialMessages,
    toolCall,
    suggestions,
    finalCallback,
    setCurrentQuestion,
  } = useMessages();

  const goToNewConversation = async (
    content: string,
    reportedActive: boolean = false,
  ) => {
    if (conversationId) return;
    const newId = uuidV4();
    conversationRef.current = newId;
    const response = await getAiTitle(content);
    if (response?.error) {
      setQuotaExceeded(true);
      push("/");
      return;
    }
    setQuotaExceeded(false);
    trackNewTitle(
      { title: response.replaceAll(`\"`, ""), reportedActive },
      newId,
    );
    push(`/${newId}${reportedActive ? "?report=enabled" : ""}`);
  };

  const clearQuery = async () => {
    await fetchInitialMessages(address);
  };

  const isPrepared = () => {
    if (!address) {
      login();
      return false;
    }
    return true;
  };

  const append = async (message: Message, reportedActive: boolean = false) => {
    if (!isPrepared()) return;
    setCurrentQuestion(message);
    appendAiChat(message);
    goToNewConversation(message.content, reportedActive);
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
    goToNewConversation(input);
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
    toolCall,
    reportEnabled,
    quotaExceeded,
    setQuotaExceeded,
  };
};

export default useChat;
