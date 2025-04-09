"use client";

import cn from "classnames";
import { Messages } from "./messages";
import ChatInput from "./ChatInput";
import ChatSkeleton from "../Chat/ChatSkeleton";
import { useVercelChat } from "@/hooks/useVercelChat";
import ChatGreeting from "../Chat/ChatGreeting";
import ChatPrompt from "../Chat/ChatPrompt";
import useVisibilityDelay from "@/hooks/useVisibilityDelay";
import { ChatReport } from "../Chat/ChatReport";

interface ChatProps {
  roomId?: string;
  reportId?: string;
}

export function Chat({ roomId, reportId }: ChatProps) {
  const {
    messages,
    status,
    isLoading,
    hasError,
    isGeneratingResponse,
    handleSendMessage,
    stop,
  } = useVercelChat({ roomId });

  const { isVisible } = useVisibilityDelay({
    shouldBeVisible: messages.length === 0 && !roomId,
    deps: [messages.length, roomId],
  });

  if (isLoading || (!!roomId && messages.length === 0)) {
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
      {messages.length > 0 || !!roomId ? (
        <Messages messages={messages} status={status}>
          {reportId && <ChatReport reportId={reportId} />}
        </Messages>
      ) : (
        <div className="w-full">
          <ChatGreeting isVisible={isVisible} />
          <ChatPrompt isVisible={isVisible} />
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
