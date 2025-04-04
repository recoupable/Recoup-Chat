import React from "react";
import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import styles from "./markdown.module.css";
import MarkdownA from "./MarkdownA";
import MarkdownPre from "./MarkdownPre";
import MarkdownCode from "./MarkdownCode";
import MarkdownImg from "./MarkdownImg";
import MarkdownTable from "./MarkdownTable";

interface ChatMarkdownProps {
  children: string;
}

const ChatMarkdown: React.FC<ChatMarkdownProps> = ({ children }) => {
  return (
    <div className={`${styles.markdown} w-full max-w-full overflow-hidden`} style={{ overflowX: 'hidden', maxWidth: '100%' }}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: MarkdownA,
          pre: MarkdownPre,
          // Type issues are handled in the component itself
          code: MarkdownCode,
          img: MarkdownImg,
          table: MarkdownTable
        }}
      >
        {children}
      </Markdown>
    </div>
  );
};

export default ChatMarkdown; 