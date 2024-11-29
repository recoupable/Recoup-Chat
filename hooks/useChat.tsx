import { Message } from "ai/react";
import { v4 as uuidV4 } from "uuid";
import { usePathname, useRouter } from "next/navigation";
import useConversations from "./useConversations";
import useMessages from "./useMessages";
import { useUserProvider } from "@/providers/UserProvder";

const useChat = () => {
  const { login, address } = useUserProvider();
  const { push } = useRouter();
  const { conversationId } = useConversations();
  const pathname = usePathname();

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

  const goToNewConversation = async (path?: string) => {
    if (conversationId && !pathname.includes("funnels")) return;
    const newId = uuidV4();
    conversationRef.current = newId;
    push(`${path || ""}/${newId}`);
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

  const append = async (message: Message, redirectTo?: string) => {
    if (!isPrepared()) return;
    setCurrentQuestion(message);
    appendAiChat(message);
    await goToNewConversation(redirectTo);
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
    await goToNewConversation(input);
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
  };
};

export default useChat;
