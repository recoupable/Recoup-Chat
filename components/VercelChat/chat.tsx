"use client";

import cn from "classnames";
import { Messages } from "./messages";
import ChatInput from "./ChatInput";
import ChatSkeleton from "../Chat/ChatSkeleton";
import ChatGreeting from "../Chat/ChatGreeting";
import ChatPrompt from "../Chat/ChatPrompt";
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
function ChatContent({ reportId, id }: { reportId?: string; id: string }) {
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

  const { isVisible } = useVisibilityDelay({
    shouldBeVisible: messages.length === 0 && !reportId,
    deps: [messages.length, reportId],
  });

  if (isLoading && roomId) {
    return <ChatSkeleton />;
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
        "px-4 md:px-0 pb-4 pt-8 flex flex-col h-dvh items-center w-full max-w-3xl",
        {
          "justify-between": messages.length > 0,
          "justify-center gap-4": messages.length === 0,
        }
      )}
    >
      {isVisible ? (
        <div className="w-full">
          <ChatGreeting isVisible={isVisible} />
          <ChatPrompt isVisible={isVisible} />
        </div>
      ) : (
        <Messages
          messages={messages}
          status={status}
          setMessages={setMessages}
          reload={reload}
        >
          {reportId && <ChatReport reportId={reportId} />}
        </Messages>
      )}

      <div className="flex flex-col gap-4 w-full">
        <ChatInput
          input={input}
          setInput={setInput}
          onSendMessage={handleSendMessage}
          isGeneratingResponse={isGeneratingResponse}
          onStop={stop}
        />
      </div>
    </div>
  );
}
