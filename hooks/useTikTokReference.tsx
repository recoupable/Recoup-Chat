import getPdfReport from "@/lib/getPdfReport";
import getReportReference from "@/lib/getReportReference";
import getTikTokAnalysisByArtistId from "@/lib/getTikTokAnalysisByArtistId";
import { useTikTokReportProvider } from "@/providers/TikTokReportProvider";
import { Conversation } from "@/types/Stack";
import { useEffect, useState } from "react";

const useTikTokReference = (message: Conversation) => {
  const {
    setTiktokNextSteps,
    setTiktokRawReportContent,
    setTiktokReportContent,
    setTiktokAnalysis,
  } = useTikTokReportProvider();
  const [reportActive, setReportActive] = useState(false);
  const [summary, setSummary] = useState("");

  useEffect(() => {
    const init = async () => {
      setReportActive(true);
      const reference = await getReportReference(
        message?.metadata?.referenceId || "",
      );
      setTiktokNextSteps(reference.next_steps);
      setTiktokRawReportContent(reference.report);
      setTiktokReportContent(getPdfReport(reference.report));
      setSummary(reference.summary);
      const analysis = await getTikTokAnalysisByArtistId(
        message?.metadata?.artistId || "",
      );
      setTiktokAnalysis(analysis);
    };
    if (!message?.metadata?.referenceId) return;
    init();
  }, [message]);

  return {
    reportActive,
    summary,
  };
};

export default useTikTokReference;
