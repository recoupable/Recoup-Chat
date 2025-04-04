import React from "react";

interface MarkdownPreProps {
  children?: React.ReactNode;
}

const MarkdownPre: React.FC<MarkdownPreProps & React.HTMLAttributes<HTMLPreElement>> = ({ 
  children,
  ...props 
}) => {
  return (
    <pre className="max-w-full overflow-x-auto p-4 bg-gray-100 rounded-md my-2" {...props}>
      {children}
    </pre>
  );
};

export default MarkdownPre; 