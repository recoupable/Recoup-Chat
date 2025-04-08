"use client";

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

          if (onSend) {
            onSend();
          }
        }
      }}
    />
  );
}
