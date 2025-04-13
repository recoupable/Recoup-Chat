"use client";

import { useEffect, useRef } from "react";

interface InputProps {
  input: string;
  setInput: (value: string) => void;
  isGeneratingResponse: boolean;
  onSend?: () => void;
}

export function Input({
  input,
  setInput,
  isGeneratingResponse,
  onSend,
}: InputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea as content changes
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
    // We want this effect to run when input changes to adjust height
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  return (
    <textarea
      ref={textareaRef}
      className="mb-12 resize-none w-full min-h-12 max-h-[200px] overflow-y-auto outline-none bg-transparent placeholder:text-zinc-400 px-2 py-2"
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

          if (onSend) {
            onSend();
          }
        }
      }}
    />
  );
}
