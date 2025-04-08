"use client";

import cn from "classnames";
import { useChat } from "@ai-sdk/react";
import { Messages } from "./messages";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useUserProvider } from "@/providers/UserProvder";
import useRoomCreation from "@/hooks/useRoomCreation";
import ChatInput from "./ChatInput";
import createMemory from "@/lib/createMemory";
import { useEffect, useRef } from "react";
import { Message } from "ai";

interface ChatProps {
  roomId?: string;
}

export function Chat({ roomId }: ChatProps) {
  const { selectedArtist } = useArtistProvider();
  const { userData } = useUserProvider();
  const { roomId: internalRoomId, createNewRoom } = useRoomCreation({
    initialRoomId: roomId,
    userId: userData?.id,
    artistId: selectedArtist?.account_id,
  });

  // Use a ref to keep track of messages that need to be stored once a room is created
  const pendingMessages = useRef<Message[]>([]);

  const { messages, append, status, stop } = useChat({
    id: "recoup-chat", // Constant ID prevents state reset when route changes
    api: `/api/chat/vercel`,
    body: {
      roomId: internalRoomId,
    },
    onFinish: (message) => {
      if (internalRoomId) {
        // If room exists, immediately store the message
        createMemory(message, internalRoomId);
      } else {
        // Otherwise, add to pending messages
        pendingMessages.current.push(message as Message);
      }
    },
    onError: () => {
      console.error("An error occurred, please try again!");
    },
  });

  // When roomId changes from undefined to a value, store all pending messages
  useEffect(() => {
    if (internalRoomId && pendingMessages.current.length > 0) {
      const storePendingMessages = async () => {
        for (const message of pendingMessages.current) {
          await createMemory(message, internalRoomId);
        }
        pendingMessages.current = [];
      };

      storePendingMessages();
    }
  }, [internalRoomId]);

  const isGeneratingResponse = ["streaming", "submitted"].includes(status);

  const handleSendMessage = (content: string) => {
    const message: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      createdAt: new Date(),
    };

    // Always append message first for immediate feedback
    append(message);

    // Track user message for storage
    if (!internalRoomId) {
      pendingMessages.current.push(message);
      createNewRoom(content);
    }
  };

  return (
    <div
      className={cn(
        "px-4 md:px-0 pb-4 pt-8 flex flex-col h-dvh items-center w-full max-w-3xl",
        {
          "justify-between": messages.length > 0,
          "justify-center gap-4": messages.length === 0,
        }
      )}
    >
      {messages.length > 0 ? (
        <Messages messages={messages} status={status} />
      ) : (
        <div className="flex flex-col gap-0.5 sm:text-2xl text-xl w-full">
          <div className="flex flex-row gap-2 items-center">
            <div>Welcome to the AI SDK Reasoning Preview.</div>
          </div>
          <div className="dark:text-zinc-500 text-zinc-400">
            What would you like me to think about today?
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 w-full">
        <ChatInput
          onSendMessage={handleSendMessage}
          isGeneratingResponse={isGeneratingResponse}
          onStop={stop}
        />
      </div>
    </div>
  );
}
