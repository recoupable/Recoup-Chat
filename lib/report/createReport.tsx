import { AGENT_API } from "../consts";
import {
  CreateSegmentReportRequest,
  CreateSegmentReportResponse,
} from "./types";

const createReport = async (segmentId: string): Promise<string | null> => {
  try {
    const request: CreateSegmentReportRequest = { segmentId };
    const response = await fetch(`${AGENT_API}/api/create_report`, {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: CreateSegmentReportResponse = await response.json();

    if (data.status === "error" || !data.reportId) {
      console.error("Error creating report:", data.error);
      return null;
    }

    return data.reportId;
  } catch (error) {
    console.error("Error creating report:", error);
    return null;
  }
};

export default createReport;
