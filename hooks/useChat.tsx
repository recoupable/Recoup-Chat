import { Message } from "ai/react";
import { useParams, useRouter } from "next/navigation";
import { useUserProvider } from "@/providers/UserProvder";
import { useMessagesProvider } from "@/providers/MessagesProvider";
import createRoom from "@/lib/createRoom";
import { useConversationsProvider } from "@/providers/ConverstaionsProvider";
import { usePromptsProvider } from "@/providers/PromptsProvider";
import { useEffect, useState, useRef } from "react";
import { v4 as uuidV4 } from "uuid";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { ArtistRecord } from "@/types/Artist";

const useChat = () => {
  const { userData, isPrepared } = useUserProvider();
  const { push } = useRouter();
  const { chat_id: chatId, agent_id: agentId } = useParams();
  const { input, appendAiChat } = useMessagesProvider();
  const { addConversation } = useConversationsProvider();
  const { messages, pending } = useMessagesProvider();
  const { getPrompts } = usePromptsProvider();
  const { selectedArtist } = useArtistProvider();
  const [appendActive, setAppendActive] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const preservedArtistRef = useRef<ArtistRecord | null>(null);

  // Store the current artist when the component mounts
  useEffect(() => {
    if (selectedArtist) {
      console.log("==== useChat: Storing current artist ====", selectedArtist.name);
      preservedArtistRef.current = selectedArtist;
      
      // Also save to localStorage as a backup
      try {
        localStorage.setItem("RECOUP_ARTIST", JSON.stringify(selectedArtist));
        console.log("Saved artist to localStorage from useChat");
      } catch (e) {
        console.error("Failed to save artist to localStorage:", e);
      }
    }
  }, [selectedArtist]);

  const createNewRoom = async (content: string) => {
    if (chatId) return;
    
    setIsLoading(true);
    
    // Use the preserved artist if available
    const artistToUse = preservedArtistRef.current || selectedArtist;
    
    console.log("==== useChat: Creating new room ====");
    console.log("Using artist:", artistToUse?.name, artistToUse?.account_id);
    
    // Create room with the content
    // Note: createRoom only accepts account_id and content parameters
    const room = await createRoom(userData.id, content);
    
    // If the room has an artist_id field, we'll update it separately
    // This is a workaround since createRoom doesn't accept artist_id
    
    addConversation(room);
    
    // Store the room's artist_id in localStorage before navigation
    if (room && artistToUse) {
      try {
        const roomArtistData = {
          roomId: room.id,
          artistId: artistToUse.account_id
        };
        localStorage.setItem("RECOUP_ROOM_ARTIST", JSON.stringify(roomArtistData));
        console.log("Saved room artist data to localStorage:", roomArtistData);
      } catch (e) {
        console.error("Failed to save room artist data to localStorage:", e);
      }
    }
    
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
    
    // Store the current artist before submission
    if (selectedArtist) {
      console.log("==== useChat: Storing artist before submission ====", selectedArtist.name);
      preservedArtistRef.current = selectedArtist;
      
      // Also save to localStorage as a backup
      try {
        localStorage.setItem("RECOUP_ARTIST", JSON.stringify(selectedArtist));
        console.log("Saved artist to localStorage before submission");
      } catch (e) {
        console.error("Failed to save artist to localStorage:", e);
      }
    }
    
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
