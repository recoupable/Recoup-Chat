import { createPdf } from "@/lib/pdf/createPdf";
import { useChatProvider } from "@/providers/ChatProvider";
import { useState } from "react";

const useDownloadReport = () => {
  const [downloading, setDownloading] = useState(false);
  const { title } = useChatProvider();

  const downloadReport = async () => {
    setDownloading(true);
    try {
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
