import ReactMarkdown from "react-markdown";

const Answer = ({ content }: { content: string | undefined }) => (
  <div className="text-sm font-sans text-pretty break-words">
    <ReactMarkdown>{content || ""}</ReactMarkdown>
  </div>
);

export default Answer;
