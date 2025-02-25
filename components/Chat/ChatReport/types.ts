export interface ReportData {
  report: string;
  next_steps: string;
  artist: {
    name: string;
    account_info: { image: string }[];
  };
}

export interface ChatReportProps {
  reportId: string;
}

export interface ReportContentProps {
  report: ReportData;
}

export interface ReportActionsProps {
  report: ReportData;
}
