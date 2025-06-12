"use client";

import cn from "classnames";
import { Input } from "./input";
import { ArrowUpIcon, StopIcon } from "./icons";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useRef } from "react";
import { useVercelChatContext } from "@/providers/VercelChatProvider";
import AttachmentsPreview from "./AttachmentsPreview";
import PureAttachmentsButton from "./PureAttachmentsButton";
import { motion } from "framer-motion";
import { Button } from "../ui/button";

interface ChatInputProps {
  onSendMessage: (event: React.FormEvent<HTMLFormElement>) => void;
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
  const { selectedArtist, sorted } = useArtistProvider();
  const { hasPendingUploads, status } = useVercelChatContext();
  const isDisabled = !selectedArtist && sorted.length > 0;

  // Create a form ref to submit the form programmatically
  const formRef = useRef<HTMLFormElement>(null);

  const isChatSubmitted = status === "submitted";
  const isChatStreaming = status === "streaming";
  // Extracted the common disabled condition (for button)
  const isButtonDisabled = isChatSubmitted || isDisabled || hasPendingUploads;

  const handleSend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isChatStreaming) {
      onStop();
    } else {
      if (input === "" || isDisabled || hasPendingUploads) return;
      onSendMessage(event);
    }
  };

  return (
    <div>
      <div className="w-full">
        <AttachmentsPreview />
      </div>
      <motion.form
        ref={formRef}
        className="w-full relative p-3 dark:bg-zinc-800 rounded-2xl flex flex-col gap-1 bg-zinc-100"
        onSubmit={handleSend}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <PureAttachmentsButton />
        </div>
        <Input
          input={input}
          setInput={setInput}
          isGeneratingResponse={isGeneratingResponse}
          onSend={() => formRef.current?.requestSubmit()}
          isDisabled={isDisabled || hasPendingUploads}
        />

        <div className="absolute bottom-2.5 right-2.5">
          <Button
            type="submit"
            className={cn(
              "size-8 flex flex-row justify-center items-center p-1.5 rounded-full hover:scale-105 active:scale-95 transition-all"
            )}
            disabled={isButtonDisabled}
          >
            {isChatStreaming ? <StopIcon /> : <ArrowUpIcon />}
          </Button>
        </div>
      </motion.form>
    </div>
  );
}

export default ChatInput;
