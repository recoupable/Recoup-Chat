import { checkSession } from "@/lib/stripe/checkSession";
import { getSession } from "@/lib/stripe/getSession";
import { useChatProvider } from "@/providers/ChatProvider";
import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";
import { useUserProvider } from "@/providers/UserProvder";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { v4 as uuidV4 } from "uuid";

const useCredits = () => {
  const searchParams = useSearchParams();
  const referenceId = searchParams.get("referenceId");
  const segmentName = searchParams.get("segmentName");
  const reportId = searchParams.get("reportId");
  const initialized = useRef(false);
  const { append } = useChatProvider();
  const { funnelType } = useFunnelAnalysisProvider();
  const { email } = useUserProvider();
  const { agent_id: agentId } = useParams();
  const funnelReportId = reportId || agentId;

  useEffect(() => {
    const init = async () => {
      if (initialized.current) return;
      initialized.current = true;
      const session = await getSession(referenceId as string);
      const paymentStatus = session?.payment_status;
      if (paymentStatus === "paid") {
        if (!session?.metadata?.credit_updated) {
          await checkSession(session.id, session?.metadata?.accountId);
          append({
            id: uuidV4(),
            role: "user",
            content: `Please create a ${funnelType || ""} fan segment report for ${funnelReportId} using this segment ${segmentName}.`,
          });
        }
      }
    };
    if (!referenceId || !funnelReportId || !segmentName || !email) return;

    init();
  }, [referenceId, funnelReportId, segmentName, email]);
};

export default useCredits;
