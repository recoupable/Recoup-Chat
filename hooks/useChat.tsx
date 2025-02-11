import { Message } from "ai/react";
import { useParams, useRouter } from "next/navigation";
import { useUserProvider } from "@/providers/UserProvder";
import { useMessagesProvider } from "@/providers/MessagesProvider";
import createRoom from "@/lib/createRoom";
import { useConversationsProvider } from "@/providers/ConverstaionsProvider";
import { usePromptsProvider } from "@/providers/PromptsProvider";
import { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";

const useChat = () => {
  const { userData, isPrepared } = useUserProvider();
  const { push } = useRouter();
  const { chat_id: chatId, agent_id: agentId } = useParams();
  const { input, appendAiChat } = useMessagesProvider();
  const { addConversation } = useConversationsProvider();
  const { messages, pending } = useMessagesProvider();
  const { getPrompts } = usePromptsProvider();
  const [appendActive, setAppendActive] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createNewRoom = async (content: string) => {
    if (chatId) return;
    setIsLoading(true);
    const room = await createRoom(userData.id, content);
    addConversation(room);
    push(`/${room.id}`);
  };

  const append = async (message: Message) => {
    if (!isPrepared()) return;
    createNewRoom(message.content);
    setAppendActive(message);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isPrepared()) return;
    append({
      id: uuidV4(),
      content: input,
      role: "user",
    });
  };

  useEffect(() => {
    if (appendActive && chatId) {
      appendAiChat(appendActive);
      setAppendActive(null);
      setIsLoading(false);
      return;
    }
  }, [appendActive, chatId]);

  useEffect(() => {
    if (messages.length && (chatId || agentId) && !pending)
      getPrompts(messages[messages.length - 1]?.content);
  }, [messages, pending, agentId, chatId]);

  return {
    handleSubmit,
    append,
    isLoading,
  };
};

export default useChat;
