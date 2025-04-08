"use client";

import cn from "classnames";
import { useChat } from "@ai-sdk/react";
import { useState, useEffect } from "react";
import { Messages } from "./messages";
import { modelID, models } from "@/lib/models";
import { Footnote } from "./footnote";
import {
  ArrowUpIcon,
  CheckedSquare,
  ChevronDownIcon,
  StopIcon,
  UncheckedSquare,
} from "./icons";
import { Input } from "./input";
import { useRouter } from "next/navigation";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useUserProvider } from "@/providers/UserProvder";
import { useConversationsProvider } from "@/providers/ConversationsProvider";
import createRoom from "@/lib/createRoom";

interface ChatProps {
  roomId?: string;
}

export function Chat({ roomId }: ChatProps) {
  const [input, setInput] = useState<string>("");
  const [selectedModelId, setSelectedModelId] = useState<modelID>("sonnet-3.7");
  const [isReasoningEnabled, setIsReasoningEnabled] = useState<boolean>(true);
  const router = useRouter();
  const { selectedArtist } = useArtistProvider();
  const { userData } = useUserProvider();
  const { addConversation } = useConversationsProvider();
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [internalRoomId, setInternalRoomId] = useState<string | undefined>(
    roomId
  );

  // Use a constant chat ID to maintain state across route changes
  const { messages, append, status, stop } = useChat({
    id: "instant-chat", // Constant ID prevents state reset when route changes
    api: `/api/chat/vercel`,
    body: {
      roomId: internalRoomId,
    },
    onError: () => {
      console.error("An error occurred, please try again!");
    },
  });

  // Update internal room ID if the prop changes
  useEffect(() => {
    if (roomId && roomId !== internalRoomId) {
      setInternalRoomId(roomId);
    }
  }, [roomId, internalRoomId]);

  const createNewRoom = async (content: string) => {
    if (
      internalRoomId ||
      isCreatingRoom ||
      !userData?.id ||
      !selectedArtist?.account_id
    )
      return;

    try {
      setIsCreatingRoom(true);
      const room = await createRoom(
        userData.id,
        content,
        selectedArtist.account_id
      );

      if (room) {
        // Update internal state first
        setInternalRoomId(room.id);
        addConversation(room);

        // Silently update the URL without affecting the UI or causing remount
        router.replace(`/instant/${room.id}`, { scroll: false });
      }
    } catch (error) {
      console.error("Error creating room:", error);
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const isGeneratingResponse = ["streaming", "submitted"].includes(status);

  // Handle message sending and room creation
  const handleSendMessage = () => {
    if (input === "") return;

    if (isGeneratingResponse) {
      stop();
    } else {
      const message = {
        role: "user" as const,
        content: input,
        createdAt: new Date(),
      };

      // Always append message first for immediate feedback
      append(message);

      // Create room after sending the message if needed
      if (!internalRoomId) {
        createNewRoom(input);
      }
    }

    setInput("");
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
        <div className="w-full relative p-3 dark:bg-zinc-800 rounded-2xl flex flex-col gap-1 bg-zinc-100">
          <Input
            input={input}
            setInput={setInput}
            selectedModelId={selectedModelId}
            isGeneratingResponse={isGeneratingResponse}
            isReasoningEnabled={isReasoningEnabled}
          />

          <div className="absolute bottom-2.5 left-2.5">
            <button
              disabled={selectedModelId !== "sonnet-3.7"}
              className={cn(
                "relative w-fit text-sm p-1.5 rounded-lg flex flex-row items-center gap-2 dark:hover:bg-zinc-600 hover:bg-zinc-200 cursor-pointer disabled:opacity-50",
                {
                  "dark:bg-zinc-600 bg-zinc-200": isReasoningEnabled,
                }
              )}
              onClick={() => {
                setIsReasoningEnabled(!isReasoningEnabled);
              }}
            >
              {isReasoningEnabled ? <CheckedSquare /> : <UncheckedSquare />}
              <div>Reasoning</div>
            </button>
          </div>

          <div className="absolute bottom-2.5 right-2.5 flex flex-row gap-2">
            <div className="relative w-fit text-sm p-1.5 rounded-lg flex flex-row items-center gap-0.5 dark:hover:bg-zinc-700 hover:bg-zinc-200 cursor-pointer">
              <div className="flex justify-center items-center text-zinc-500 dark:text-zinc-400 px-1">
                <span className="pr-1">{models[selectedModelId]}</span>
                <ChevronDownIcon />
              </div>

              <select
                className="absolute opacity-0 w-full p-1 left-0 cursor-pointer"
                value={selectedModelId}
                onChange={(event) => {
                  if (event.target.value !== "sonnet-3.7") {
                    setIsReasoningEnabled(true);
                  }
                  setSelectedModelId(event.target.value as modelID);
                }}
              >
                {Object.entries(models).map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <button
              className={cn(
                "size-8 flex flex-row justify-center items-center dark:bg-zinc-100 bg-zinc-900 dark:text-zinc-900 text-zinc-100 p-1.5 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-300 hover:scale-105 active:scale-95 transition-all",
                {
                  "dark:bg-zinc-200 dark:text-zinc-500":
                    isGeneratingResponse || input === "",
                }
              )}
              onClick={handleSendMessage}
            >
              {isGeneratingResponse ? <StopIcon /> : <ArrowUpIcon />}
            </button>
          </div>
        </div>

        <Footnote />
      </div>
    </div>
  );
}
