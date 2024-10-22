import { Message } from "ai/react";
import useInitialMessages from "./useInitialMessages";
import { v4 as uuidV4 } from "uuid";
import useUser from "./useUser";
import useSuggestions from "./useSuggestions";
import { useRouter } from "next/navigation";
import trackNewConversation from "@/lib/stack/trackNewConversation";
import useConverstaion from "./useConversation";
import useMessages from "./useMessages";

const useChat = () => {
  const { login, address } = useUser();
  const { fetchInitialMessages } = useInitialMessages();
  const { finalCallback, suggestions, setCurrentQuestion } = useSuggestions();
  const { push } = useRouter();
  const { conversationId } = useConverstaion();
  const {
    conversationRef,
    input,
    appendAiChat,
    handleAiChatSubmit,
    handleInputChange,
    messagesRef,
    pending,
  } = useMessages();

  const goToNewConversation = async (name: string) => {
    if (conversationId) return;
    const newId = uuidV4();
    conversationRef.current = newId;
    await trackNewConversation(address, newId, name);
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
  };
};

export default useChat;
