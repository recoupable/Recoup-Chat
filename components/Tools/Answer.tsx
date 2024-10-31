import { Message } from "ai";
import ReactMarkdown from "react-markdown";

const Answer = ({ message }: { message: Message }) => {
  const content = message?.content;

  return (
    <div className="text-sm font-sans text-pretty break-words">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default Answer;
