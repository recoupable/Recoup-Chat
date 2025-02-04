import extractMails from "@/lib/extractMail";
import { mkConfig, generateCsv, download } from "export-to-csv";

const useFansCSVExport = () => {
  const exportCSV = (fansSegments: any) => {
    const segments = fansSegments.map((fanSegment: any) => ({
      ...fanSegment.socials,
      segment_name: fanSegment.segment_name,
      email: extractMails(fanSegment.socials.bio || ""),
    }));
    const csvConfig = mkConfig({ useKeysAsHeaders: true });
    const csv = generateCsv(csvConfig)(segments);
    download(csvConfig)(csv);
  };

  return {
    exportCSV,
  };
};

export default useFansCSVExport;
