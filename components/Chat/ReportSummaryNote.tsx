import Icon from "../Icon";
import useDownloadReport from "@/hooks/useDownloadReport";
import { useTikTokReportProvider } from "@/providers/TikTokReportProvider";

const ReportSummaryNote = () => {
  const {
    tiktokNextSteps,
    tiktokReportContent,
    isGeneratingReport,
    tiktokAnalysis,
  } = useTikTokReportProvider();
  const { downloadReport } = useDownloadReport();
  return (
    <>
      <button
        type="button"
        className="text-purple-dark mt-6"
        onClick={downloadReport}
        disabled={isGeneratingReport}
      >
        {isGeneratingReport
          ? "Generating Report..."
          : `[Download Full Report PDF]`}
      </button>
      <p className="pt-4 pb-2 text-[20px]">Next Steps</p>
      <div
        dangerouslySetInnerHTML={{
          __html: tiktokNextSteps,
        }}
      />
      {tiktokReportContent && (
        <div className="bg-white w-full min-h-screen fixed top-[99999999px] left-0 flex justify-center z-[99999999]">
          <div
            id="segment-report"
            className="flex flex-col text-black max-w-[9.5in] w-full bg-white p-[0.3in] text-[11pt] leading-normal relative box-border min-h-[11in]"
          >
            <div className="grow w-full">
              <div className="w-full aspect-[757/146] rounded-lg flex items-center justify-center overflow-hidden relative mb-6">
                {/* eslint-disable-next-line  @next/next/no-img-element */}
                <img
                  src={tiktokAnalysis?.avatar}
                  alt="not found pic"
                  className="w-full"
                />
                <div className="absolute left-0 top-0 size-full flex items-center justify-end pr-3 gap-2">
                  <p className="text-white font-bold text-[40px]">
                    {tiktokAnalysis?.nickname}
                  </p>
                  <div className="pt-9">
                    <Icon name="logo-xl" />
                  </div>
                  <p className="text-white font-bold text-[40px]">Recoup</p>
                </div>
              </div>
              <div
                dangerouslySetInnerHTML={{
                  __html: tiktokReportContent,
                }}
              />
            </div>
            <div className="w-full flex justify-center">
              <Icon name="logo-xl" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportSummaryNote;
