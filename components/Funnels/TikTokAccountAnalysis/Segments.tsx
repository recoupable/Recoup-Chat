import { useTikTokAnalysisProvider } from "@/providers/TIkTokAnalysisProvider";
import Icon from "@/components/Icon";
import LucideIcon from "@/components/LucideIcon";
import { usePaymentProvider } from "@/providers/PaymentProvider";
import decreaseCredits from "@/lib/supabase/decreaseCredits";
import getCredits from "@/lib/supabase/getCredits";
import { useUserProvider } from "@/providers/UserProvder";
import { v4 as uuidV4 } from "uuid";
import { useChatProvider } from "@/providers/ChatProvider";

const Segments = () => {
  const { append } = useChatProvider();
  const { segments, username, result } = useTikTokAnalysisProvider();
  const { createCheckoutSession } = usePaymentProvider();
  const { userData, isPrepared } = useUserProvider();

  const handleGenerateReport = (segmentName: string) => {
    append(
      {
        id: uuidV4(),
        role: "user",
        content: `Please create a tiktok fan segment report for ${result.id} using this segment ${segmentName}.`,
      },
      true,
    );
  };

  const payNow = async (segmentName: string) => {
    if (!isPrepared()) return;
    const credits = await getCredits(userData?.id);
    if (!credits?.remaining_credits) {
      await createCheckoutSession(
        `${result?.name || username}'s fan segment report: ${segmentName}`,
      );
      return;
    }
    await decreaseCredits(userData?.id);
    handleGenerateReport(segmentName);
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
            {segment?.name} {`(${segment?.count})`}
          </p>
        </button>
      ))}
    </div>
  );
};

export default Segments;
