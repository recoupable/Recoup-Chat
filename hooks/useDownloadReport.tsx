import { createPdf } from "@/lib/pdf/createPdf";
import sendReportEmail from "@/lib/sendReportEmail";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useChatProvider } from "@/providers/ChatProvider";
import { useConversationsProvider } from "@/providers/ConverstaionsProvider";
import { useTikTokReportProvider } from "@/providers/TikTokReportProvider";
import { useUserProvider } from "@/providers/UserProvder";
import { useState } from "react";

const useDownloadReport = () => {
  const [downloading, setDownloading] = useState(false);
  const { streamingTitle } = useConversationsProvider();
  const { email } = useUserProvider();
  const { tiktokRawReportContent, tiktokAnalysis } = useTikTokReportProvider();
  const { selectedArtist } = useArtistProvider();
  const { titleMessage } = useChatProvider();

  const downloadReport = async () => {
    setDownloading(true);
    try {
      const title = streamingTitle?.title || titleMessage?.metadata?.title;

      sendReportEmail(
        tiktokRawReportContent,
        tiktokAnalysis?.avatar || selectedArtist?.image,
        tiktokAnalysis?.nickname || selectedArtist?.name,
        email || "",
        title,
      );
      const doc = await createPdf({
        pdfDomElementId: "segment-report",
        name: `${title}.pdf`,
      });
      doc?.save(`${title}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setDownloading(false);
    }
  };

  return {
    downloadReport,
    downloading,
  };
};

export default useDownloadReport;
