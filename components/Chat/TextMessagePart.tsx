"use client";

import Markdown from "react-markdown";
import { TextPart } from "@/types/reasoning";

interface TextMessagePartProps {
  part: TextPart;
}

export function TextMessagePart({ part }: TextMessagePartProps) {
  return (
    <div className="flex flex-col gap-4">
      <Markdown>{part.text}</Markdown>
    </div>
  );
}
