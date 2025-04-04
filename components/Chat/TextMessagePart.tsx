"use client";

import { TextPart } from "@/types/reasoning";
import ChatMarkdown from "./ChatMarkdown";

interface TextMessagePartProps {
  part: TextPart;
}

export function TextMessagePart({ part }: TextMessagePartProps) {
  return (
    <ChatMarkdown>
      {part.text}
    </ChatMarkdown>
  );
}
