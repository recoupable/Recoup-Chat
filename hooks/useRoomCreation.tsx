"use client";

import { useState } from "react";
import createRoom from "@/lib/createRoom";
import { useConversationsProvider } from "@/providers/ConversationsProvider";

interface UseRoomCreationProps {
  id?: string;
  userId?: string;
  artistId?: string;
}

export function useRoomCreation({
  id,
  userId,
  artistId,
}: UseRoomCreationProps) {
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const { addConversation } = useConversationsProvider();

  const createNewRoom = async (content: string) => {
    if (isCreatingRoom || !userId) return;

    try {
      setIsCreatingRoom(true);
      const room = await createRoom(userId, content, artistId, id);

      if (room) {
        addConversation(room);
        // Silently update the URL without affecting the UI or causing remount
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
    isCreatingRoom,
    createNewRoom,
  };
}

export default useRoomCreation;
