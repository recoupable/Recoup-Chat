import { checkSession } from "@/lib/stripe/checkSession";
import { getSession } from "@/lib/stripe/getSession";
import { useChatProvider } from "@/providers/ChatProvider";
import { useTikTokAnalysisProvider } from "@/providers/TIkTokAnalysisProvider";
import { useUserProvider } from "@/providers/UserProvder";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { v4 as uuidV4 } from "uuid";

const useCredits = () => {
  const searchParams = useSearchParams();
  const referenceId = searchParams.get("referenceId");
  const segmentName = searchParams.get("segmentName");
  const initialized = useRef(false);
  const { append } = useChatProvider();
  const { result } = useTikTokAnalysisProvider();
  const { email } = useUserProvider();

  useEffect(() => {
    const init = async () => {
      if (initialized.current) return;
      initialized.current = true;
      const session = await getSession(referenceId as string);
      const paymentStatus = session?.payment_status;
      if (paymentStatus === "paid") {
        if (!session?.metadata?.credit_updated) {
          await checkSession(
            session.id,
            session?.metadata?.chatId,
            session?.metadata?.accountId,
          );
          append(
            {
              id: uuidV4(),
              role: "user",
              content: `Please create a tiktok fan segment report for ${result.id} using this segment ${segmentName}.`,
            },
            true,
          );
        }
      }
    };
    if (!referenceId || !result?.id || !segmentName || !email) return;

    init();
  }, [referenceId, result, segmentName, email]);
};

export default useCredits;
