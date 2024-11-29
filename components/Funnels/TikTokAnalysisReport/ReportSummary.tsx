import { useToolCallProvider } from "@/providers/ToolCallProvider";

const ReportSummary = () => {
  const { answer } = useToolCallProvider();
  return (
    <section>
      <div
        className="text-sm font-sans text-pretty break-words"
        dangerouslySetInnerHTML={{
          __html: decodeURIComponent(answer?.replaceAll("%", "&#37;") || ""),
        }}
      />
    </section>
  );
};

export default ReportSummary;
