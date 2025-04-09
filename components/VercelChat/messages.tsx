"use client";

import cn from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, SpinnerIcon } from "./icons";
import { UIMessage } from "ai";
import { UseChatHelpers } from "@ai-sdk/react";
import ChatMarkdown from "../Chat/ChatMarkdown";

interface ReasoningPart {
  type: "reasoning";
  reasoning: string;
  details: Array<{ type: "text"; text: string }>;
}

interface ReasoningMessagePartProps {
  part: ReasoningPart;
  isReasoning: boolean;
}

export function ReasoningMessagePart({
  part,
  isReasoning,
}: ReasoningMessagePartProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const variants = {
    collapsed: {
      height: 0,
      opacity: 0,
      marginTop: 0,
      marginBottom: 0,
    },
    expanded: {
      height: "auto",
      opacity: 1,
      marginTop: "1rem",
      marginBottom: 0,
    },
  };

  useEffect(() => {
    if (isReasoning) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [isReasoning]);

  return (
    <div className="flex flex-col">
      {isReasoning ? (
        <div className="flex flex-row gap-2 items-center">
          <div className="font-medium text-sm">Reasoning</div>
          <div className="animate-spin">
            <SpinnerIcon />
          </div>
        </div>
      ) : (
        <div className="flex flex-row gap-2 items-center">
          <div className="font-medium text-sm">Reasoned for a few seconds</div>
          <button
            className={cn(
              "cursor-pointer rounded-full dark:hover:bg-zinc-800 hover:bg-zinc-200",
              {
                "dark:bg-zinc-800 bg-zinc-200": isExpanded,
              }
            )}
            onClick={() => {
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? <ChevronDownIcon /> : <ChevronUpIcon />}
          </button>
        </div>
      )}

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="reasoning"
            className="text-sm dark:text-zinc-400 text-zinc-600 flex flex-col gap-4 border-l pl-3 dark:border-zinc-800"
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={variants}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {part.details.map((detail, detailIndex) =>
              detail.type === "text" ? (
                <ChatMarkdown key={detailIndex}>{detail.text}</ChatMarkdown>
              ) : (
                "<redacted>"
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface TextMessagePartProps {
  text: string;
}

export function TextMessagePart({ text }: TextMessagePartProps) {
  return (
    <div className="flex flex-col gap-4">
      <ChatMarkdown>{text}</ChatMarkdown>
    </div>
  );
}

interface MessagesProps {
  messages: Array<UIMessage>;
  status: UseChatHelpers["status"];
}

export function Messages({ messages, status }: MessagesProps) {
  const messagesRef = useRef<HTMLDivElement>(null);
  const messagesLength = useMemo(() => messages.length, [messages]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messagesLength]);

  return (
    <div
      className="flex flex-col gap-8 overflow-y-scroll items-center w-full"
      ref={messagesRef}
    >
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex flex-col gap-4 last-of-type:mb-12 first-of-type:mt-16 w-full"
          )}
        >
          <div
            className={cn("flex flex-col gap-4", {
              "dark:bg-zinc-800 bg-zinc-200 p-2 rounded-xl w-fit ml-auto":
                message.role === "user",
              "": message.role === "assistant",
            })}
          >
            {message.parts?.map((part, partIndex) => {
              if (part.type === "text") {
                return (
                  <TextMessagePart
                    key={`${message.id}-${partIndex}`}
                    text={part.text}
                  />
                );
              }

              if (part.type === "reasoning") {
                return (
                  <ReasoningMessagePart
                    key={`${message.id}-${partIndex}`}
                    // @ts-expect-error export ReasoningUIPart
                    part={part}
                    isReasoning={
                      status === "streaming" &&
                      partIndex === message.parts.length - 1
                    }
                  />
                );
              }
            })}
          </div>
        </div>
      ))}

      {(status === "submitted" || status === "streaming") && (
        <div className="text-zinc-500 mb-12 w-full flex items-center gap-2">
          Hmm...
          <div className="inline-block animate-spin">
            <SpinnerIcon />
          </div>
        </div>
      )}
    </div>
  );
}
