import getSegmentReport from "@/lib/report/getSegmentReport";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

let timer: any = null;

const useFunnelReport = () => {
  const [isLoadingReport, setIsLoadingReport] = useState(true);
  const [funnelNextSteps, setFunnelNextSteps] = useState("");
  const [funnelReportContent, setFunnelReportContent] = useState("");
  const [funnelRawReportContent, setFunnelRawReportContent] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [bannerArtistName, setBannerArtistName] = useState("");
  const [pitchName, setPitchName] = useState("");
  const { chat_id: chatId } = useParams();
  const pathname = usePathname();
  const isReportPage = pathname.includes("/report");

  const getFunnelReport = async () => {
    if (chatId && isReportPage) {
      const {
        artistImage,
        artistName,
        reportContent,
        rawReportContent,
        nextSteps,
      } = await getSegmentReport(chatId as string);
      if (!rawReportContent) return;
      setFunnelReportContent(reportContent);
      setFunnelRawReportContent(rawReportContent);
      setFunnelNextSteps(nextSteps);
      setBannerImage(artistImage);
      setBannerArtistName(artistName);
      setIsLoadingReport(false);
      clearInterval(timer);
      return;
    }
    clearReportCache();
    setIsLoadingReport(true);
    clearInterval(timer);
  };

  useEffect(() => {
    getFunnelReport();
    timer = setInterval(getFunnelReport, 3000);
    return () => clearInterval(timer);
  }, [chatId, isReportPage]);

  const clearReportCache = () => {
    setFunnelNextSteps("");
    setFunnelRawReportContent("");
    setFunnelReportContent("");
    setBannerArtistName("");
    setBannerImage("");
  };

  return {
    setFunnelNextSteps,
    funnelNextSteps,
    funnelReportContent,
    setIsLoadingReport,
    isLoadingReport,
    setFunnelReportContent,
    setFunnelRawReportContent,
    funnelRawReportContent,
    clearReportCache,
    bannerImage,
    bannerArtistName,
    setBannerArtistName,
    setBannerImage,
    pitchName,
    setPitchName,
  };
};

export default useFunnelReport;
