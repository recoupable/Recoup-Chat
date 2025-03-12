import type { Message } from "@ai-sdk/react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';

interface UserMessageProps {
  message: Message;
}

const UserMessage = ({ message }: UserMessageProps) => {
  // Decode the content if it's URL encoded
  const decodedContent = decodeURIComponent(
    message.content.replaceAll("%", "&#37;") || ""
  );

  return (
    <div className="grow flex justify-end max-w-[90%]">
      <section>
        <div className="text-sm font-sans max-w-[500px] text-pretty break-words bg-grey px-4 p-2 rounded-full">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize]}
            components={{
              // Simplified styling for user messages
              p: ({...props}) => <span {...props} />,
              // Prevent block elements from breaking the bubble UI
              h1: ({...props}) => <strong {...props} />,
              h2: ({...props}) => <strong {...props} />,
              h3: ({...props}) => <strong {...props} />,
              ul: ({...props}) => <span {...props} />,
              ol: ({...props}) => <span {...props} />,
              li: ({...props}) => <span>• {props.children}</span>,
              table: () => <span>Tables not supported in user messages</span>,
            }}
          >
            {decodedContent}
          </ReactMarkdown>
        </div>
      </section>
    </div>
  );
};

export default UserMessage;
