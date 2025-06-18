import React from "react";

interface MarkdownPreProps {
  children?: React.ReactNode;
}

const MarkdownPre: React.FC<MarkdownPreProps & React.HTMLAttributes<HTMLPreElement>> = ({ 
  children,
  ...props 
}) => {
  return (
    <pre {...props}>
      {children}
    </pre>
  );
};

export default MarkdownPre; 