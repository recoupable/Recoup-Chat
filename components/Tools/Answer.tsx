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
      dangerouslySetInnerHTML={{
        __html: decodeURIComponent(content || ""),
      }}
    />
    <Insights />
  </section>
);

export default Answer;
