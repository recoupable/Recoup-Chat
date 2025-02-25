import { useUserProvider } from "@/providers/UserProvder";
import { usePaymentProvider } from "@/providers/PaymentProvider";
import { useFunnelReportProvider } from "@/providers/FunnelReportProvider";
import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";
import { useRouter } from "next/navigation";

const useGenerateSegmentReport = () => {
  const { isPrepared } = useUserProvider();
  const {
    toggleModal,
    setSuccessCallbackParams,
    isLoadingCredits,
    creditUsed,
    credits,
    subscriptionActive,
  } = usePaymentProvider();
  const { setIsLoadingReport } = useFunnelReportProvider();
  const { funnelType } = useFunnelAnalysisProvider();
  const { push } = useRouter();

  const handleGenerateReport = async (
    segmentId: string,
    segmentName: string
  ) => {
    if (!isPrepared()) return;
    if (isLoadingCredits) return;

    const minimumCredits = funnelType === "wrapped" ? 5 : 1;
    if (credits >= minimumCredits || subscriptionActive) {
      if (!subscriptionActive) await creditUsed(minimumCredits);
      setIsLoadingReport(true);
      push(`/segment/${segmentId}`);
      return;
    }

    setSuccessCallbackParams(
      new URLSearchParams({
        segmentId,
        segmentName,
      }).toString()
    );
    toggleModal(minimumCredits === 5);
  };

  return {
    handleGenerateReport,
  };
};

export default useGenerateSegmentReport;
