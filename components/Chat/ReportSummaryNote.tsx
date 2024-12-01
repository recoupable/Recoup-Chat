import useDownloadReport from "@/hooks/useDownloadReport";
import { useToolCallProvider } from "@/providers/ToolCallProvider";
import Icon from "../Icon";

const ReportSummaryNote = () => {
  const { downloadReport } = useDownloadReport();
  const { tiktokReportContent } = useToolCallProvider();

  return (
    <>
      <button
        type="button"
        className="text-purple-dark mt-6"
        onClick={downloadReport}
      >{`[Download Full Report PDF]`}</button>
      <p className="py-4 text-[20px]">Next Steps</p>
      <ul className="text-[14px] space-y-2 ml-5">
        <li className="list-disc">
          <span className="font-bold">Explore Partnership Opportunities:</span>{" "}
          Select a suggested brand to generate a tailored pitch deck.
        </li>
        <li className="list-disc">
          <span className="font-bold">Refine Content Ideas:</span> Get
          recommendations for TikTok content tailored to this segment..
        </li>
        <li className="list-disc">
          <span className="font-bold">Monitor & Update:</span> Enable continuous
          tracking for this segment to uncover new trends and engagement
          opportunities. Ongoing Tracking Enabled ✅
        </li>
      </ul>
      {tiktokReportContent && (
        <div className="bg-white w-full min-h-screen fixed top-[99999999px] left-0 flex justify-center z-[99999999]">
          <div
            id="segment-report"
            className="text-black max-w-[9.5in] w-full bg-white p-[0.3in] text-[11pt] leading-normal relative box-border min-h-[11in]"
          >
            <div
              dangerouslySetInnerHTML={{
                __html: tiktokReportContent,
              }}
            />
            <div className="flex justify-center items-center py-10">
              <Icon name="logo" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportSummaryNote;
