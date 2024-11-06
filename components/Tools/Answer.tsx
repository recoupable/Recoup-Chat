import ReactMarkdown from "react-markdown";
import Insights from "./Insights";

const Answer = ({
  content,
  role,
}: {
  content: string | undefined;
  role: string;
}) => (
  <section>
    <div
      className={`text-sm font-sans text-pretty break-words ${role === "user" ? "bg-[#f4f4f438] px-4 p-2 rounded-full" : ""}`}
    >
      <ReactMarkdown>{content || ""}</ReactMarkdown>
    </div>
    <Insights />
  </section>
);

export default Answer;
