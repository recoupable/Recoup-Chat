import formatPdf from "./formatPdf";

const getPdfReport = (rawReportContent: string) => {
  const content = rawReportContent
    .toString()
    .replaceAll('\\"', '"')
    .replaceAll("\\n", "");

  const reportContent = content.replaceAll(/\\n/g, "");

  return formatPdf(reportContent);
};

export default getPdfReport;
