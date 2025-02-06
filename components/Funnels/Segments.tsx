import useCredits from "@/hooks/useCredits";
import useGenerateSegmentReport from "@/hooks/useGenerateSegmentReport";
import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";
import { useParams } from "next/navigation";
import BaseSegments from "../Segments/BaseSegments";

const FunnelSegments = () => {
  useCredits();
  const { handleGenerateReport } = useGenerateSegmentReport();
  const { segments, funnelType } = useFunnelAnalysisProvider();
  const { agent_id: agentId } = useParams();

  const handleSegmentClick = (segmentName: string) => {
    handleGenerateReport(
      (agentId as string) || "",
      segmentName,
      funnelType as string
    );
  };

  return (
    <BaseSegments segments={segments} onSegmentClick={handleSegmentClick} />
  );
};

export default FunnelSegments;
