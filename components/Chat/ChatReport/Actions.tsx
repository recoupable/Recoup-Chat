"use client";

import { ReportActionsProps } from "./types";
import useDownloadReport from "@/hooks/useDownloadReport";
import SocialSharing from "@/components/SocialSharing";

export const ChatReportActions = ({ report }: ReportActionsProps) => {
  const { downloadReport } = useDownloadReport();

  return (
    <div className="w-full">
      <SocialSharing />
      <p className="pt-4 text-[18px]">Next Steps</p>
      <div
        dangerouslySetInnerHTML={{
          __html: report.next_steps,
        }}
      />
      <button
        type="button"
        className="text-purple-dark mt-2"
        onClick={downloadReport}
      >
        {`[Download Full Report PDF]`}
      </button>
    </div>
  );
};
