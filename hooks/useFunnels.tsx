import { useFunnelReportProvider } from "@/providers/FunnelReportProvider";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const useFunnels = () => {
  const { funnelRawReportContent, funnelAnalysis } = useFunnelReportProvider();
  const [funnelContext, setFunnelContext] = useState("");
  const searchParams = useSearchParams();
  const funnel_report = searchParams.get("funnel_report");
  const pathname = usePathname();

  useEffect(() => {
    if (
      pathname.includes("tiktok") ||
      pathname.includes("twitter") ||
      funnel_report
    ) {
      setFunnelContext(
        funnelRawReportContent || JSON.stringify(funnelAnalysis),
      );
    }
  }, [pathname, funnel_report]);

  return {
    funnelContext,
  };
};

export default useFunnels;
