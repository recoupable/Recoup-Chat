import React from "react";

interface MarkdownPreProps {
  children?: React.ReactNode;
}

const MarkdownPre: React.FC<MarkdownPreProps & React.HTMLAttributes<HTMLPreElement>> = ({ 
  children,
  ...props 
}) => {
  return (
    <pre className="!max-w-xs md:!max-w-2xl !mx-auto" {...props}>
      {children}
    </pre>
  );
};

export default MarkdownPre; 