export interface CreateSegmentReportRequest {
  segmentId: string;
}

export interface CreateSegmentReportResponse {
  status: "success" | "error";
  reportId?: string;
  error?: string;
}
