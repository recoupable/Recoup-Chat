import React from "react";

interface MarkdownPreProps {
  children?: React.ReactNode;
}

const MarkdownPre: React.FC<MarkdownPreProps & React.HTMLAttributes<HTMLPreElement>> = ({ 
  children,
  ...props 
}) => {
  return (
    <pre {...props} className="grid">
      {children}
    </pre>
  );
};

export default MarkdownPre; 