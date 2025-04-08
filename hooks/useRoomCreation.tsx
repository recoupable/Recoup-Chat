"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const { addConversation } = useConversationsProvider();

  const createNewRoom = async (content: string) => {
    if (roomId || isCreatingRoom || !userId) return;

    try {
      setIsCreatingRoom(true);
      const room = await createRoom(userId, content, artistId);

      if (room) {
        // Update internal state first
        setRoomId(room.id);
        addConversation(room);

        // Silently update the URL without affecting the UI or causing remount
        router.replace(`/instant/${room.id}`, { scroll: false });
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
