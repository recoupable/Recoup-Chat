"use client";

import { useEffect } from "react";
import { useInstantChat } from "@/providers/InstantChatProvider";
import { cn } from "@/lib/utils";
import { IconRobot, IconUser, IconMessageChatbot } from "@tabler/icons-react";

interface InstantMessagesProps {
  scroll: ({ smooth, y }: { smooth: boolean; y: number }) => void;
  className?: string;
}

const InstantMessages = ({ scroll, className }: InstantMessagesProps) => {
  const { messages, isUserReady, loginUser } = useInstantChat();

  const scrollTo = () => scroll({ smooth: true, y: Number.MAX_SAFE_INTEGER });

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollTo();
  }, [messages]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderEmptyState = () => {
    if (!isUserReady) {
      return (
        <div className="flex flex-col items-center justify-center h-full py-10">
          <IconUser className="h-12 w-12 mb-3 text-gray-400" />
          <p className="text-gray-500 mb-4">User data not available</p>
          <button
            onClick={loginUser}
            className="py-2 px-4 rounded-md bg-primary text-white"
          >
            Login to Chat
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full py-10">
        <IconMessageChatbot className="h-12 w-12 mb-3 text-gray-400" />
        <p className="text-gray-500">Type a message to start chatting</p>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "w-full h-full max-w-3xl mx-auto overflow-y-auto",
        className
      )}
    >
      {messages.length === 0
        ? renderEmptyState()
        : messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex items-start gap-x-3 py-4 px-4", {
                "bg-secondary/50": message.role === "assistant",
                "justify-end": message.role === "user",
              })}
            >
              {message.role === "assistant" && (
                <div className="flex h-6 w-6 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
                  <IconRobot className="h-4 w-4" />
                </div>
              )}
              <div
                className={cn("flex flex-col space-y-1.5", {
                  "w-fit": message.role === "user",
                })}
              >
                <div>{message.content}</div>
              </div>
            </div>
          ))}
    </div>
  );
};

export default InstantMessages;
