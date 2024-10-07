import { useEffect, useRef, useState } from "react";
import SubmitButton from "./SubmitButton";
import { useChatProvider } from "@/providers/ChatProvider";

const ChatInput: React.FC = () => {
  const { input, handleInputChange, handleSubmit } = useChatProvider();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isChatboxFocused, setIsChatboxFocused] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl bg-white rounded-md p-1.5 mb-3 transition-all duration-150 ease-in-out relative shadow-lg hover:shadow-xl hover:scale-[1.02] group"
    >
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsChatboxFocused(true)}
          onBlur={() => setIsChatboxFocused(false)}
          placeholder="Ask me anything about the music industry..."
          className="w-full bg-transparent text-black outline-none text-xs py-2 px-2 resize-none min-h-[60px] pr-10 font-normal transition-colors duration-150 ease-in-out focus:bg-gray-50"
          aria-label="Chat input"
        />
        <SubmitButton isChatboxFocused={isChatboxFocused} />
      </div>
    </form>
  );
};

export default ChatInput;
