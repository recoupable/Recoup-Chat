"use client";

import { useChat } from "@ai-sdk/react";

interface InputProps {
  input: string;
  setInput: (value: string) => void;
  selectedModelId: string;
  isGeneratingResponse: boolean;
  isReasoningEnabled: boolean;
}

export function Input({
  input,
  setInput,
  selectedModelId,
  isGeneratingResponse,
  isReasoningEnabled,
}: InputProps) {
  const { append } = useChat({
    id: "primary",
    api: "/api/chat/vercel",
    body: {
      selectedModelId,
      isReasoningEnabled,
    },
    onError: () => {
      console.error("An error occurred, please try again!");
    },
  });

  return (
    <textarea
      className="mb-12 resize-none w-full min-h-12 outline-none bg-transparent placeholder:text-zinc-400"
      placeholder="Send a message"
      value={input}
      autoFocus
      onChange={(event) => {
        setInput(event.currentTarget.value);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();

          if (input === "") {
            return;
          }

          if (isGeneratingResponse) {
            console.error("Please wait for the model to finish its response!");

            return;
          }

          append({
            role: "user",
            content: input,
            createdAt: new Date(),
          });

          setInput("");
        }
      }}
    />
  );
}
