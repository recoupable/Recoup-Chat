import React from 'react';

interface FallbackFormattedTextProps {
  content: string;
  className?: string;
}

/**
 * A very simple fallback implementation that doesn't use any external libraries
 * This is used as a last resort when other markdown libraries fail to load
 */
export const FallbackFormattedText = ({
  content,
  className = "",
}: FallbackFormattedTextProps) => {
  // Very basic formatting using regex
  const formattedContent = content
    // Bold: **text** or __text__
    .replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>')
    // Italic: *text* or _text_
    .replace(/(\*|_)(.*?)\1/g, '<em>$2</em>')
    // Code: `code`
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Headers: # Header, ## Header, ### Header
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    // Lists: - item or * item
    .replace(/^[\*\-] (.*)$/gm, '<li>$1</li>')
    // Wrap lists in <ul> - using a simpler approach without 's' flag
    .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
    // Links: [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Line breaks
    .replace(/\n/g, '<br />');

  return (
    <div 
      className={`text-sm font-sans max-w-[500px] text-pretty break-words formatted-content ${className}`}
      dangerouslySetInnerHTML={{ __html: formattedContent }}
    />
  );
};

export default FallbackFormattedText; 