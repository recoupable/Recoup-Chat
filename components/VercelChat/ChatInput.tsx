"use client";

import cn from "classnames";
import { Input } from "./input";
import { ArrowUpIcon, StopIcon } from "./icons";
import { useArtistProvider } from "@/providers/ArtistProvider";

interface ChatInputProps {
  onSendMessage: () => void;
  isGeneratingResponse: boolean;
  onStop: () => void;
  setInput: (input: string) => void;
  input: string;
}

export function ChatInput({
  onSendMessage,
  isGeneratingResponse,
  onStop,
  setInput,
  input,
}: ChatInputProps) {
  // Access the artist state to check if an artist is selected
  const { selectedArtist } = useArtistProvider();
  const isDisabled = !selectedArtist;

  const handleSend = () => {
    if (input === "" || isDisabled) return;

    if (isGeneratingResponse) {
      onStop();
    } else {
      onSendMessage();
    }
  };

  return (
    <div className="w-full relative p-3 dark:bg-zinc-800 rounded-2xl flex flex-col gap-1 bg-zinc-100">
      <Input
        input={input}
        setInput={setInput}
        isGeneratingResponse={isGeneratingResponse}
        onSend={handleSend}
        isDisabled={isDisabled}
      />

      <div className="absolute bottom-2.5 right-2.5">
        <button
          type="button"
          className={cn(
            "size-8 flex flex-row justify-center items-center dark:bg-zinc-100 bg-zinc-900 dark:text-zinc-900 text-zinc-100 p-1.5 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-300 hover:scale-105 active:scale-95 transition-all",
            {
              "dark:bg-zinc-200 dark:text-zinc-500 cursor-not-allowed opacity-50":
                isGeneratingResponse || input === "" || isDisabled,
            }
          )}
          onClick={handleSend}
          disabled={isGeneratingResponse || input === "" || isDisabled}
        >
          {isGeneratingResponse ? <StopIcon /> : <ArrowUpIcon />}
        </button>
      </div>
    </div>
  );
}

export default ChatInput;
