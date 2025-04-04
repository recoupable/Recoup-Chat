import React from "react";

interface MarkdownImgProps {
  src?: string;
  alt?: string;
}

const MarkdownImg: React.FC<MarkdownImgProps & React.ImgHTMLAttributes<HTMLImageElement>> = ({ 
  alt = '',
  ...props 
}) => {
  return (
    <img 
      className="max-w-full h-auto" 
      alt={alt}
      {...props} 
    />
  );
};

export default MarkdownImg; 