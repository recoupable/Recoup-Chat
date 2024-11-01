import ReactMarkdown from "react-markdown";
import Insights from "./Insights";

const Answer = ({ content }: { content: string | undefined }) => (
  <section>
    <div className="text-sm font-sans text-pretty break-words">
      <ReactMarkdown>{content || ""}</ReactMarkdown>
    </div>
    <Insights />
  </section>
);

export default Answer;
