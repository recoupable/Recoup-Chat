import { useCsrfToken } from "@/packages/shared/src/hooks";
import { Message, useChat as useAiChat } from "ai/react";
import { useQueryClient } from "@tanstack/react-query";
import useInitialMessages from "./useInitialMessages";
import { v4 as uuidV4 } from "uuid";
import useUser from "./useUser";
import useMessages from "./useMessages";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import trackNewConversation from "@/lib/stack/trackNewConversation";

const useChat = () => {
  const { login, address } = useUser();
  const csrfToken = useCsrfToken();
  const accountId = "3664dcb4-164f-4566-8e7c-20b2c93f9951";
  const queryClient = useQueryClient();
  const [conversationId, setConversationId] = useState("");
  const { initialMessages, fetchInitialMessages } =
    useInitialMessages(conversationId);
  const { finalCallback, suggestions, setCurrentQuestion } =
    useMessages(conversationId);
  const { push } = useRouter();
  const { conversation } = useParams();

  const goToNewConversation = async (name: string) => {
    if (conversation) return;
    const newId = uuidV4();
    setConversationId(newId);
    await trackNewConversation(address, newId, name);
    push(`/${newId}`);
  };

  console.log("ZIAD HERE", initialMessages)

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
        conversationRef.current,
      );
      void queryClient.invalidateQueries({
        queryKey: ["credits", accountId],
      });
    },
  });

  const messagesRef = useRef(messages);
  const conversationRef = useRef((conversation as string) || conversationId);

  useEffect(() => {
    if ((conversation as string) || conversationId) {
      conversationRef.current = (conversation as string) || conversationId;
    }
  }, [conversation, conversationId]);

  useEffect(() => {
    if (messages.length) messagesRef.current = messages;
  }, [messages]);

  const createNewConversation = () => {
    const newId = uuidV4();
    setConversationId(newId);
  };

  const clearQuery = async () => {
    const messages = await fetchInitialMessages(address);
    if (!messages) return;
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
    createNewConversation,
  };
};

export default useChat;
