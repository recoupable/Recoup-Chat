import { useChatProvider } from "@/providers/ChatProvider";
import Suggestions from "./Suggestions";
import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";

const ChatInput: React.FC = () => {
  const { input, handleInputChange, handleSubmit } = useChatProvider();
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
      textarea.style.height = 'auto'; 
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  return (
    <div className="w-full">
      <div className="w-full px-2 z-[10] bg-background">
        <div className="bg-white dark:bg-black border-gray-500 dark:border-gray-700 border-[1px] rounded-md p-2 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask Recoup a question..."
              className="bg-transparent w-full p-2 text-sm !border-none !outline-none rounded-md resize-none min-h-[40px] max-h-[200px] overflow-y-auto pr-12"
              aria-label="Chat input"
            />
            <button
              type="submit"
              className="absolute bottom-2 right-2 p-2 rounded-lg bg-black dark:bg-white"
              disabled={!input.trim()}
            >
              <ArrowUpRight className="h-3.5 w-3.5 text-white dark:text-black stroke-[2.5]" />
            </button>
          </form>
        </div>
      </div>
      <Suggestions />
    </div>
  );
};

export default ChatInput;
