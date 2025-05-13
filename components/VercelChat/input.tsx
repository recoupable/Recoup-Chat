"use client";

import { useEffect, useRef } from "react";
import { Textarea } from "../ui/textarea";

interface InputProps {
  input: string;
  setInput: (value: string) => void;
  isGeneratingResponse: boolean;
  onSend?: () => void;
  isDisabled?: boolean;
}

export function Input({
  input,
  setInput,
  isGeneratingResponse,
  onSend,
  isDisabled = false, // Default to false if not provided
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
    <Textarea
      ref={textareaRef}
      className="mb-12 resize-none min-h-12 max-h-[200px] overflow-y-auto outline-none placeholder:text-zinc-400 px-2 py-2 disabled:opacity-75 focus-within:ring-0 focus-visible:ring-0 shadow-none border-none"
      placeholder={isDisabled ? "Select an artist first" : "Send a message"}
      value={input}
      disabled={isDisabled}
      onChange={(event) => {
        setInput(event.currentTarget.value);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();

          if (input === "" || isDisabled) {
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
