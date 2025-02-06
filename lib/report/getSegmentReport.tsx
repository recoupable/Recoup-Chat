import getPdfReport from "../getPdfReport";

const getSegmentReport = async (reportId: string) => {
  try {
    const response = await fetch(`/api/segment_report?reportId=${reportId}`);
    const data = await response.json();

    return {
      reportContent: getPdfReport(data?.data?.report || ""),
      rawReportContent: data.data?.report,
      nextSteps: data.data?.next_steps,
      artistImage: data.data?.artist?.account_info?.[0].image,
      artistName: data.data?.artist?.name,
    };
  } catch (error) {
    console.error(error);
    return {
      reportContent: "",
      rawReportContent: "",
      nextSteps: "",
      artistImage: "",
      artistName: "",
    };
  }
};

export default getSegmentReport;
