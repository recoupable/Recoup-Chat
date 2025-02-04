import { FormEvent } from "react";
import SubmitButton from "./SubmitButton";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
}: ChatInputProps) {
  return (
    <div className="w-full">
      <div className="w-full px-2 z-[10]">
        <div className="border-grey border-[1px] shadow-grey rounded-md p-2 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="w-full">
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Ask Recoup a question..."
              className="bg-transparent w-full p-2 text-sm !border-none !outline-none rounded-md resize-none min-h-[40px] max-h-[200px] overflow-y-auto"
              aria-label="Chat input"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
                }
              }}
            />
            <div className="w-full flex justify-end gap-2">
              <SubmitButton canSubmit={!!input.trim()} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
