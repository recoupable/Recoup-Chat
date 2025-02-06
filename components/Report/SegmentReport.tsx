import { useFunnelReportProvider } from "@/providers/FunnelReportProvider";
import ReportHTML from "./ReportHTML";
import ReportNextSteps from "./ReportNextSteps";
import ReportSkeleton from "./ReportSkeleton";

const SegmentReport = () => {
  const { isLoadingReport } = useFunnelReportProvider();

  return (
    <div className="px-3 w-full">
      {isLoadingReport ? (
        <ReportSkeleton />
      ) : (
        <div className="w-full">
          <div>
            <ReportHTML />
            <ReportNextSteps />
          </div>
        </div>
      )}
    </div>
  );
};

export default SegmentReport;
