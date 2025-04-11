"use client";

import type { Message } from "ai";
import { useChat } from "@ai-sdk/react";
import { Messages } from "./messages";
import { MultimodalInput } from "./ChatInput";
import generateUUID from "@/lib/generateUUID";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { ChatPrompt } from "../Chat/ChatPrompt";
import ChatGreeting from "../Chat/ChatGreeting";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useUserProvider } from "@/providers/UserProvder";

export function Chat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages?: Message[];
}) {
  const { userData } = useUserProvider();
  const { roomId } = useParams();
  const { selectedArtist } = useArtistProvider();

  const { messages, handleSubmit, input, setInput, status, stop, setMessages } =
    useChat({
      id,
      api: "/api/chat/vercel",
      body: {
        id,
        artistId: selectedArtist?.account_id,
        accountId: userData?.id,
      },
      initialMessages,
      experimental_throttle: 100,
      sendExtraMessageFields: true,
      generateId: generateUUID,

      onError: () => {
        toast.error("An error occurred, please try again!");
      },
    });

  return (
    <>
      <div className="px-4 md:px-0 pb-4 pt-8 flex flex-col h-dvh items-center w-full max-w-3xl">
        <Messages status={status} messages={messages} />
        <form className="flex flex-col gap-4 w-full">
          <MultimodalInput
            chatId={id}
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            status={status}
            stop={stop}
            setMessages={setMessages}
          />
        </form>
      </div>
    </>
  );
}
