import { useParams, useRouter } from "next/navigation";
import { useUserProvider } from "@/providers/UserProvder";
import { useMessagesProvider } from "@/providers/MessagesProvider";
import createRoom from "@/lib/createRoom";
import { useConversationsProvider } from "@/providers/ConversationsProvider";
import { usePromptsProvider } from "@/providers/PromptsProvider";
import { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { ChatMessage } from "@/types/reasoning";

const useChat = () => {
  const { userData, isPrepared } = useUserProvider();
  const { push } = useRouter();
  const { chat_id: chatId, agent_id: agentId } = useParams();
  const { input, appendAiChat, handleInputChange } = useMessagesProvider();
  const { addConversation } = useConversationsProvider();
  const { messages, pending } = useMessagesProvider();
  const { getPrompts } = usePromptsProvider();
  const { selectedArtist } = useArtistProvider();
  const [isLoading, setIsLoading] = useState(false);

  // Create room in background without blocking UI
  const createNewRoom = async (content: string) => {
    if (chatId) return;

    try {
      // Create room but don't wait for redirect
      const room = await createRoom(
        userData.id,
        content,
        selectedArtist?.account_id
      );
      addConversation(room);

      // Silent route change
      push(`/${room.id}`);
    } catch (error) {
      console.error("[useChat] Error creating room:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isPrepared()) return;

    // Create message
    const message: ChatMessage = {
      id: uuidV4(),
      content: input,
      role: "user",
    };

    // Clear input immediately
    handleInputChange({
      target: { value: "" },
    } as React.ChangeEvent<HTMLTextAreaElement>);

    // Show message immediately in UI
    appendAiChat(message);

    // Start room creation in background
    if (!chatId) {
      setIsLoading(true);
      createNewRoom(message.content);
    }
  };

  useEffect(() => {
    if (messages.length && (chatId || agentId) && !pending)
      getPrompts(messages[messages.length - 1]?.content);
  }, [messages, pending, agentId, chatId]);

  return {
    handleSubmit,
    isLoading,
  };
};

export default useChat;
