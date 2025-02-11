import { createPdf } from "@/lib/pdf/createPdf";
import { useState } from "react";

const useDownloadReport = () => {
  const [downloading, setDownloading] = useState(false);

  const downloadReport = async () => {
    setDownloading(true);
    try {
      const reportTitle = "report";
      const doc = await createPdf({
        pdfDomElementId: "segment-report",
        name: `${reportTitle}.pdf`,
      });
      doc?.save(`${reportTitle}.pdf`);
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
