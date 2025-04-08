import { useEffect, useRef } from "react";
import { Message } from "ai";
import createMemory from "@/lib/createMemory";

/**
 * Hook to track messages created before a room exists and store them once the room is created
 * @param roomId - The current room ID (undefined if no room created yet)
 * @returns An object with methods to track and manage pending messages
 */
export function usePendingMessages(roomId?: string) {
  // Track messages that need to be stored once a room is created
  const pendingMessages = useRef<Message[]>([]);

  // When roomId changes from undefined to a value, store all pending messages
  useEffect(() => {
    if (roomId && pendingMessages.current.length > 0) {
      const storePendingMessages = async () => {
        for (const message of pendingMessages.current) {
          await createMemory(message, roomId);
        }
        pendingMessages.current = [];
      };

      storePendingMessages();
    }
  }, [roomId]);

  /**
   * Track a message to be stored once a room is created
   * @param message - The message to track
   */
  const trackMessage = (message: Message) => {
    pendingMessages.current.push(message);
  };

  /**
   * Check if there are any pending messages
   * @returns True if there are pending messages, false otherwise
   */
  const hasPendingMessages = () => pendingMessages.current.length > 0;

  /**
   * Get the current count of pending messages
   * @returns The number of pending messages
   */
  const getPendingMessageCount = () => pendingMessages.current.length;

  return {
    trackMessage,
    hasPendingMessages,
    getPendingMessageCount,
  };
}
