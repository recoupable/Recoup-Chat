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

  const createNewRoom = async (content: string) => {
    if (roomId || isCreatingRoom || !userId || !artistId) return;

    try {
      setIsCreatingRoom(true);
      const room = await createRoom(userId, content, artistId);

      if (room) {
        // Update internal state first
        setRoomId(room.id);
        addConversation(room);

        // Use direct history API for more reliable URL updates across environments
        // This avoids potential issues with Next.js router in production
        const newUrl = `/instant/${room.id}`;
        window.history.replaceState(
          { ...window.history.state, as: newUrl, url: newUrl },
          "",
          newUrl
        );

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
