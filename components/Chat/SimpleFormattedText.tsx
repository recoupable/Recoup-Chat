import React, { useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

interface SimpleFormattedTextProps {
  content: string;
  className?: string;
}

/**
 * A simplified markdown renderer using marked and DOMPurify
 * This component is more compatible with various deployment environments
 */
export const SimpleFormattedText = ({
  content,
  className = "",
}: SimpleFormattedTextProps) => {
  // Configure marked options
  marked.setOptions({
    gfm: true, // GitHub Flavored Markdown
    breaks: true, // Convert \n to <br>
  });

  // Process the content with marked and sanitize it
  const sanitizedHtml = useMemo(() => {
    // Configure DOMPurify to allow certain tags and attributes
    const purifyConfig = {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'ul', 'ol', 'li', 
        'blockquote', 'code', 'pre', 'hr', 'br', 'em', 'strong', 'del',
        'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img', 'span', 'div'
      ],
      ALLOWED_ATTR: [
        'href', 'id', 'class', 'target', 'rel', 'src', 'alt', 'title'
      ]
    };
    
    // Parse markdown to HTML and sanitize
    const html = marked.parse(content);
    return DOMPurify.sanitize(typeof html === 'string' ? html : '', purifyConfig);
  }, [content]);

  return (
    <div 
      className={`text-sm font-sans max-w-[500px] text-pretty break-words formatted-content ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};

export default SimpleFormattedText; 