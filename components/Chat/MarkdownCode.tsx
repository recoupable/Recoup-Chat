import React from "react";
import { type Components } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface CodeBlockProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const MarkdownCode: Components['code'] = (props: CodeBlockProps) => {
  const { inline, className, children } = props;
  
  // Extract language from className (format: language-*)
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";

  if (!inline) {
    return (
        <SyntaxHighlighter
          language={language}
          style={oneLight}
          customStyle={{ 
            margin: 0,
            borderRadius: "0.375rem",
            fontSize: "0.9em",
            lineHeight: 1.6,
          }}
          showLineNumbers
          wrapLines
          wrapLongLines
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
    );
  }
  
  return (
    <code className="px-1.5 py-0.5 rounded-sm bg-gray-100 font-mono text-sm">
      {children}
    </code>
  );
};

export default MarkdownCode; 