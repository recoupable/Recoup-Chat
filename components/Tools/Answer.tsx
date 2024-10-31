import { useToolCallProvider } from "@/providers/ToolCallProvider";
import { Message } from "ai";
import ReactMarkdown from "react-markdown";

const Answer = ({ message }: { message: Message }) => {
  const { answer } = useToolCallProvider();
  const content = message.content || answer;

  return (
    <div className="text-sm font-sans text-pretty break-words">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default Answer;
