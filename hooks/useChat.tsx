import { Message } from "ai/react";
import { v4 as uuidV4 } from "uuid";
import useSuggestions from "./useSuggestions";
import { useRouter } from "next/navigation";
import useConversations from "./useConversations";
import useMessages from "./useMessages";
import { useUserProvider } from "@/providers/UserProvder";

const useChat = () => {
  const { login, address } = useUserProvider();
  const { finalCallback, suggestions, setCurrentQuestion } = useSuggestions();
  const { push } = useRouter();
  const { conversationId } = useConversations();
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
  } = useMessages();

  const goToNewConversation = async (name: string) => {
    if (conversationId) return;
    const newId = uuidV4();
    conversationRef.current = newId;
    push(`/${newId}`);
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

  const append = async (message: Message) => {
    if (!isPrepared()) return;
    setCurrentQuestion(message);
    appendAiChat(message);
    await goToNewConversation(message.content);
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
