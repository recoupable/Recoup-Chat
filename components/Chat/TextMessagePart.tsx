"use client";

import { TextPart } from "@/types/reasoning";
import Markdown from "./ChatMarkdown-v2/markdown";

interface TextMessagePartProps {
  part: TextPart;
}

export function TextMessagePart({ part }: TextMessagePartProps) {
  return <Markdown content={part.text} />
}
