import React from "react";

interface MarkdownAProps {
  href?: string;
  children?: React.ReactNode;
}

const MarkdownA: React.FC<MarkdownAProps & React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({ 
  children,
  ...props 
}) => {
  return (
    <a 
      {...props} 
      target="_blank" 
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
};

export default MarkdownA; 