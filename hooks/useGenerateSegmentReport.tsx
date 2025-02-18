import { useUserProvider } from "@/providers/UserProvder";
import { usePaymentProvider } from "@/providers/PaymentProvider";
import { useFunnelReportProvider } from "@/providers/FunnelReportProvider";
import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";
import { useArtistProvider } from "@/providers/ArtistProvider";
import createReport from "@/lib/report/createReport";
import { useConversationsProvider } from "@/providers/ConverstaionsProvider";
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
  const { selectedArtist } = useArtistProvider();
  const { addConversation } = useConversationsProvider();
  const { push } = useRouter();

  const openReportChat = async (segmentId: string, segmentName: string) => {
    setIsLoadingReport(true);
    const reportId = await createReport(segmentId);

    if (!reportId) {
      setIsLoadingReport(false);
      return;
    }

    const metadata = {
      title: `${segmentName} Report`,
      account_id: selectedArtist?.account_id,
      is_funnel_report: true,
      conversationId: reportId,
    };

    addConversation(metadata);
    push(`/report/${reportId}`);
  };

  const handleGenerateReport = async (
    segmentId: string,
    segmentName: string
  ) => {
    if (!isPrepared()) return;
    if (isLoadingCredits) return;

    const minimumCredits = funnelType === "wrapped" ? 5 : 1;
    if (credits >= minimumCredits || subscriptionActive) {
      if (!subscriptionActive) await creditUsed(minimumCredits);
      openReportChat(segmentId, segmentName);
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
