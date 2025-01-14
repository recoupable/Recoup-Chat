import Icon from "@/components/Icon";
import LucideIcon from "@/components/LucideIcon";
import { useUserProvider } from "@/providers/UserProvder";
import { v4 as uuidV4 } from "uuid";
import { useChatProvider } from "@/providers/ChatProvider";
import useCredits from "@/hooks/useCredits";
import { usePaymentProvider } from "@/providers/PaymentProvider";
import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";
import { useParams } from "next/navigation";

const Segments = () => {
  const { append } = useChatProvider();
  const { segments, funnelType } = useFunnelAnalysisProvider();
  const { chat_id: chatId } = useParams();
  const { isPrepared } = useUserProvider();
  useCredits();
  const {
    toggleModal,
    setSuccessCallbackParams,
    isLoadingCredits,
    creditUsed,
    credits,
    subscriptionActive,
  } = usePaymentProvider();

  const handleGenerateReport = (segmentName: string) => {
    append(
      {
        id: uuidV4(),
        role: "user",
        content: `Please create a ${funnelType} fan segment report for ${chatId} using this segment ${segmentName}.`,
      },
      true,
    );
  };

  const payNow = async (segmentName: string) => {
    if (!isPrepared()) return;
    if (isLoadingCredits) return;
    const minimumCredits = funnelType === "wrapped" ? 5 : 1;
    if (credits >= minimumCredits || subscriptionActive) {
      if (!subscriptionActive) await creditUsed(minimumCredits);
      handleGenerateReport(segmentName);
      return;
    }
    setSuccessCallbackParams(new URLSearchParams({ segmentName }).toString());
    toggleModal(minimumCredits === 5);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 pt-4 gap-3">
      {segments.map((segment) => (
        <button
          className="w-full border-grey-light border-[1px] rounded-md px-3 py-2 flex gap-2 items-center shadow-grey"
          type="button"
          key={segment?.name}
          onClick={() => payNow(segment?.name)}
        >
          {segment?.icon ? (
            <LucideIcon name={segment.icon} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <Icon name="logo-xs" />
          )}

          <p className="font-bold text-xs text-center">
            {segment?.name} {`(${segment?.count || segment?.size})`}
          </p>
        </button>
      ))}
    </div>
  );
};

export default Segments;
