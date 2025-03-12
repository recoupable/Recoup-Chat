import type { Message } from "@ai-sdk/react";
import React from 'react';

interface FallbackUserMessageProps {
  message: Message;
}

/**
 * A very simple fallback user message component that doesn't use any external libraries
 * This is used as a last resort when other markdown libraries fail to load
 */
const FallbackUserMessage = ({ message }: FallbackUserMessageProps) => {
  // Decode the content if it's URL encoded
  const decodedContent = decodeURIComponent(
    message.content.replaceAll("%", "&#37;") || ""
  );

  // Very basic formatting using regex
  const formattedContent = decodedContent
    // Bold: **text** or __text__
    .replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>')
    // Italic: *text* or _text_
    .replace(/(\*|_)(.*?)\1/g, '<em>$2</em>')
    // Code: `code`
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Line breaks
    .replace(/\n/g, '<br />');

  return (
    <div className="grow flex justify-end max-w-[90%]">
      <section>
        <div 
          className="text-sm font-sans max-w-[500px] text-pretty break-words bg-grey px-4 p-2 rounded-full"
          dangerouslySetInnerHTML={{ __html: formattedContent }}
        />
      </section>
    </div>
  );
};

export default FallbackUserMessage; 