import { checkSession } from "@/lib/stripe/checkSession";
import { getSession } from "@/lib/stripe/getSession";
import increaseCredits from "@/lib/supabase/increaseCredits";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const useCredits = () => {
  const searchParams = useSearchParams();
  const referenceId = searchParams.get("referenceId");
  const { push } = useRouter();
  const initialized = useRef(false);

  useEffect(() => {
    const init = async () => {
      if (initialized.current) return;
      initialized.current = true;
      const session = await getSession(referenceId as string);
      const paymentStatus = session?.payment_status;
      if (paymentStatus === "paid") {
        if (!session?.metadata?.credit_updated) {
          await increaseCredits(session?.metadata?.accountId);
          await checkSession(
            session.id,
            session?.metadata?.chatId,
            session?.metadata?.accountId,
          );
        }

        push(`/funnels/tiktok-account-analysis/${session?.metadata?.chatId}`);
        return;
      }

      push("/funnels/tiktok-account-analysis/");
    };
    if (!referenceId) {
      push("/funnels/tiktok-account-analysis/");
      return;
    }
    init();
  }, [referenceId]);
};

export default useCredits;
