import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";
import Thought from "./Thought";

const ThoughtSteps = () => {
  const { thoughts, funnelType } = useFunnelAnalysisProvider();

  return (
    <div
      className={`font-bold ${funnelType === "wrapped" ? "text-sm" : "text-md"}`}
    >
      {thoughts &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Object.entries(thoughts)?.map(([key, thought]: any) => (
          <div key={key} className="flex gap-2">
            <Thought funnel={key} thought={thought} />
          </div>
        ))}
    </div>
  );
};

export default ThoughtSteps;
