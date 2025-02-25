"use client";

import { ChatReportProps } from "./types";
import { useReportData } from "@/hooks/useReportData";
import { ChatReportContent } from "./Content";
import { ChatReportActions } from "./Actions";
import { Skeleton } from "@/components/ui/skeleton";

export const ChatReport = ({ reportId }: ChatReportProps) => {
  const { data, isLoading, error, isError } = useReportData(reportId);
  if (isError) {
    return (
      <div className="px-3 w-full text-red-500">
        Error loading report:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  if (isLoading || !data?.report || !data?.next_steps) {
    return (
      <div className="px-3 w-full">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  return (
    <div className="px-3 w-full">
      <ChatReportContent report={data} />
      <ChatReportActions report={data} />
    </div>
  );
};
