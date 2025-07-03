"use client";

import cn from "classnames";
import { Messages } from "./messages";
import ChatInput from "./ChatInput";
import ChatSkeleton from "../Chat/ChatSkeleton";
import ChatGreeting from "../Chat/ChatGreeting";
import ChatPrompt from "../Chat/ChatPrompt";
import StarterAgents from "../Chat/StarterAgents";
import useVisibilityDelay from "@/hooks/useVisibilityDelay";
import { ChatReport } from "../Chat/ChatReport";
import { useParams } from "next/navigation";
import { useAutoLogin } from "@/hooks/useAutoLogin";
import { useArtistFromRoom } from "@/hooks/useArtistFromRoom";
import {
  VercelChatProvider,
  useVercelChatContext,
} from "@/providers/VercelChatProvider";
import { Message } from "ai";
import { useDropzone } from "@/hooks/useDropzone";
import FileDragOverlay from "./FileDragOverlay";
import { Loader } from "lucide-react";
import { memo, useCallback } from "react";

interface ChatProps {
  id: string;
  reportId?: string;
  initialMessages?: Message[];
}

export function Chat({ id, reportId, initialMessages }: ChatProps) {
  return (
    <VercelChatProvider chatId={id} initialMessages={initialMessages}>
      <ChatContent reportId={reportId} id={id} />
    </VercelChatProvider>
  );
}

// Inner component that uses the context
function ChatContentMemoized({ reportId, id }: {reportId?: string; id: string;}) {
  const {
    messages,
    status,
    isLoading,
    hasError,
    isGeneratingResponse,
    handleSendMessage,
    stop,
    setInput,
    input,
    setMessages,
    reload,
  } = useVercelChatContext();
  const { roomId } = useParams();
  useAutoLogin();
  useArtistFromRoom(id);
  const { getRootProps, isDragActive } = useDropzone();

  const { isVisible } = useVisibilityDelay({
    shouldBeVisible: messages.length === 0 && !reportId && status === "ready",
    deps: [messages.length, reportId, status],
  });

  // Memoize the handler to prevent re-renders
  const handleSendMessageMemoized = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      handleSendMessage(event);
    },
    [handleSendMessage]
  );

  if (isLoading) {
    return roomId ? (
      <ChatSkeleton />
    ) : (
      <div className="flex size-full items-center justify-center">
        <Loader className="block size-5 text-grey-dark-1 animate-spin" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <div className="text-red-500">
          Failed to load messages. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "px-4 md:px-0 pb-4 flex flex-col h-full items-center w-full max-w-3xl relative",
        {
          "justify-between": messages.length > 0,
        }
      )}
      {...getRootProps()}
    >
      {isDragActive && <FileDragOverlay />}
      <div className="absolute w-full h-6 bg-gradient-to-t from-transparent via-white/80 to-white z-10 top-0"></div>
      {isVisible ? (
        <>
          {/* Spacer to push content to center */}
          <div className="flex-1"></div>

          {/* Centered greeting and chat input */}
          <div className="w-full">
            <ChatGreeting isVisible={isVisible} />
            <ChatPrompt isVisible={isVisible} />
            <div className="mt-6">
              <ChatInput
                input={input}
                setInput={setInput}
                onSendMessage={handleSendMessageMemoized}
                isGeneratingResponse={isGeneratingResponse}
                onStop={stop}
              />
            </div>
          </div>

          {/* Spacer to balance and bottom section */}
          <div className="flex-1">
            <StarterAgents isVisible={isVisible} />
          </div>
        </>
      ) : (
        <>
          <Messages
            messages={messages}
            status={status}
            setMessages={setMessages}
            reload={reload}
          >
            {reportId && <ChatReport reportId={reportId} />}
          </Messages>
          <div className="w-full">
            <ChatInput
              input={input}
              setInput={setInput}
              onSendMessage={handleSendMessageMemoized}
              isGeneratingResponse={isGeneratingResponse}
              onStop={stop}
            />
          </div>
        </>
      )}
    </div>
  );
}

const ChatContent = memo(ChatContentMemoized, (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id && prevProps.reportId === nextProps.reportId
  );
});
