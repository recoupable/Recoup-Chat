import type { Message } from "@ai-sdk/react";
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import React, { useMemo } from 'react';

interface SimpleUserMessageProps {
  message: Message;
}

/**
 * A simplified user message component that uses marked for basic formatting
 * This component is more compatible with various deployment environments
 */
const SimpleUserMessage = ({ message }: SimpleUserMessageProps) => {
  // Decode the content if it's URL encoded
  const decodedContent = decodeURIComponent(
    message.content.replaceAll("%", "&#37;") || ""
  );

  // Configure marked for simple inline formatting only
  marked.setOptions({
    gfm: true,
    breaks: true,
  });

  // Process the content with marked and sanitize it
  const sanitizedHtml = useMemo(() => {
    // Configure DOMPurify to allow only basic inline formatting
    const purifyConfig = {
      ALLOWED_TAGS: ['strong', 'em', 'code', 'br', 'span'],
      ALLOWED_ATTR: ['class']
    };
    
    // Parse markdown to HTML and sanitize
    const html = marked.parse(decodedContent);
    return DOMPurify.sanitize(typeof html === 'string' ? html : '', purifyConfig);
  }, [decodedContent]);

  return (
    <div className="grow flex justify-end max-w-[90%]">
      <section>
        <div 
          className="text-sm font-sans max-w-[500px] text-pretty break-words bg-grey px-4 p-2 rounded-full"
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      </section>
    </div>
  );
};

export default SimpleUserMessage; 