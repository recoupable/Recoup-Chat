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
      className={`text-sm font-sans max-w-[500px] text-pretty break-words ${role === "user" ? "bg-grey px-4 p-2 rounded-full" : ""}`}
      dangerouslySetInnerHTML={{
        __html: decodeURIComponent(content?.replaceAll("%", "&#37;") || ""),
      }}
    />
    <Insights />
  </section>
);

export default Answer;
