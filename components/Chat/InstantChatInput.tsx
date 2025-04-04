"use client";

import { useRef, useEffect } from "react";
import { useInstantChat } from "@/providers/InstantChatProvider";

const InstantChatInput = () => {
  const { input, handleInputChange, handleSubmit, isUserReady, pending } =
    useInstantChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  // Auto-resize textarea as content changes
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const getButtonText = () => {
    if (!isUserReady) return "Loading...";
    if (pending) return "Sending...";
    return "Send";
  };

  return (
    <div className="w-full">
      <div className="w-full px-2 z-[10]">
        <div className="border-grey border-[1px] shadow-grey rounded-md p-2 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="w-full">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={
                isUserReady ? "Ask a question..." : "Loading user data..."
              }
              className="bg-transparent w-full p-2 text-sm !border-none !outline-none rounded-md resize-none min-h-[40px] max-h-[200px] overflow-y-auto"
              aria-label="Chat input"
              disabled={!isUserReady}
            />
            <div className="w-full flex justify-end gap-2">
              <button
                type="submit"
                disabled={!isUserReady || !input.trim() || pending}
                className="py-2 px-4 rounded-md bg-primary text-white disabled:opacity-50"
              >
                {getButtonText()}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InstantChatInput;
