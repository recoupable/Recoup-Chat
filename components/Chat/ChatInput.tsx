import SubmitButton from "./SubmitButton";
import { useChatProvider } from "@/providers/ChatProvider";
import { useEffect, useRef } from "react";
import SideSuggestions from "./SideSuggestions";
import { useMessagesProvider } from "@/providers/MessagesProvider";

const ChatInput: React.FC = () => {
  const { handleSubmit } = useChatProvider();
  const { input, handleInputChange } = useMessagesProvider();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

  return (
    <div className="w-full">
      <div className="w-full px-2 z-[10]">
        <div className="w-[calc(100vw-90px)] max-w-3xl mx-auto">
          <SideSuggestions />
        </div>
        <div className="border-grey  border-[1px] shadow-grey rounded-md p-2 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="w-full">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask Recoup a question..."
              className="bg-transparent w-full p-2 text-sm !border-none !outline-none rounded-md resize-none min-h-[40px] max-h-[200px] overflow-y-auto"
              aria-label="Chat input"
            />
            <div className="w-full flex justify-end gap-2">
              <SubmitButton canSubmit={Boolean(input)} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
