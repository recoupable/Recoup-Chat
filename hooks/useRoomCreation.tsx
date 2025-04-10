"use client";

import { useState } from "react";
import createRoom from "@/lib/createRoom";
import { useConversationsProvider } from "@/providers/ConversationsProvider";

interface UseRoomCreationProps {
  initialRoomId?: string;
  userId?: string;
  artistId?: string;
}

export function useRoomCreation({
  initialRoomId,
  userId,
  artistId,
}: UseRoomCreationProps) {
  const [roomId, setRoomId] = useState<string | undefined>(initialRoomId);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const { addConversation } = useConversationsProvider();

  const createNewRoom = async (content: string, chatId?: string) => {
    if (roomId || isCreatingRoom || !userId) return;

    try {
      setIsCreatingRoom(true);
      const room = await createRoom(userId, content, artistId, chatId);

      if (room) {
        // Update internal state first
        setRoomId(room.id);
        addConversation(room);

        // Use history API directly to update URL without affecting the UI
        // This is more reliable in production than Next.js router
        window.history.replaceState({}, "", `/instant/${room.id}`);
        return room.id;
      }
    } catch (error) {
      console.error("Error creating room:", error);
    } finally {
      setIsCreatingRoom(false);
    }

    return null;
  };

  return {
    roomId,
    isCreatingRoom,
    createNewRoom,
    setRoomId,
  };
}

export default useRoomCreation;
