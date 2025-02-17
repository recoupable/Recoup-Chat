import { useUserProvider } from "@/providers/UserProvder";
import { usePaymentProvider } from "@/providers/PaymentProvider";
import { useFunnelReportProvider } from "@/providers/FunnelReportProvider";
import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";
import { useArtistProvider } from "@/providers/ArtistProvider";
import createReport from "@/lib/report/createReport";
import trackNewChatEvent from "@/lib/stack/trackNewChatEvent";
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
  const { email, address } = useUserProvider();
  const { addConversation } = useConversationsProvider();
  const { push } = useRouter();

  const openReportChat = async (agentId: string, segmentName: string) => {
    setIsLoadingReport(true);
    const reportId = await createReport({
      agentId,
      address,
      segmentName,
      email,
      artistId: selectedArtist?.account_id,
    });
    const metadta = {
      title: `${segmentName} Report`,
      account_id: selectedArtist?.account_id,
      is_funnel_report: true,
      conversationId: reportId,
    };
    trackNewChatEvent(address, metadta);
    addConversation(metadta);
    push(`/report/${reportId}`);
  };

  const handleGenerateReport = async (agentId: string, segmentName: string) => {
    if (!isPrepared()) return;
    if (isLoadingCredits) return;
    const minimumCredits = funnelType === "wrapped" ? 5 : 1;
    if (credits >= minimumCredits || subscriptionActive) {
      if (!subscriptionActive) await creditUsed(minimumCredits);
      openReportChat(agentId, segmentName);
      return;
    }
    setSuccessCallbackParams(
      new URLSearchParams({
        segmentName,
        agentId,
      }).toString(),
    );
    toggleModal(minimumCredits === 5);
  };

  return {
    handleGenerateReport,
  };
};

export default useGenerateSegmentReport;
