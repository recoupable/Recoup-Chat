"use client";

import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import { TextPart } from "@/types/reasoning";
import styles from "./markdown.module.css";

interface TextMessagePartProps {
  part: TextPart;
}

export function TextMessagePart({ part }: TextMessagePartProps) {
  return (
    <div className={styles.markdown}>
      <Markdown 
        remarkPlugins={[remarkGfm]}
      >
        {part.text}
      </Markdown>
    </div>
  );
}
