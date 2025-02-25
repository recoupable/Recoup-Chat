import { useQuery } from "@tanstack/react-query";
import { ReportData } from "@/components/Chat/ChatReport/types";

const fetchReport = async (reportId: string): Promise<ReportData> => {
  const response = await fetch(`/api/segment_report?reportId=${reportId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch report: ${response.statusText}`);
  }
  const json = await response.json();
  return json.data;
};

export const useReportData = (reportId: string) => {
  return useQuery({
    queryKey: ["report", reportId],
    queryFn: () => fetchReport(reportId),
    refetchInterval: 3000, // Poll every 3 seconds
    enabled: !!reportId,
    retry: 3,
    staleTime: 1000, // Consider data stale after 1 second
  });
};
