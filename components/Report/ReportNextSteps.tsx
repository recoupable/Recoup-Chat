import Icon from "../Icon";
import useDownloadReport from "@/hooks/useDownloadReport";
import addPageBreak from "@/lib/pdf/addPageBreak";
import { useFunnelReportProvider } from "@/providers/FunnelReportProvider";
import SocialSharing from "../SocialSharing";

const ReportNextSteps = () => {
  const {
    bannerImage,
    bannerArtistName,
    funnelNextSteps,
    funnelReportContent,
  } = useFunnelReportProvider();
  const { downloadReport } = useDownloadReport();

  return (
    <>
      <SocialSharing />
      <p className="pt-4 text-[18px]">Next Steps</p>
      <div
        dangerouslySetInnerHTML={{
          __html: funnelNextSteps,
        }}
      />
      {funnelReportContent && (
        <div className="bg-white w-full min-h-screen fixed top-[99999999px] left-0 flex justify-center z-[99999999]">
          <div
            id="segment-report"
            className="flex flex-col text-black min-h-[11in] max-w-[9.5in] w-full bg-white p-[0.3in] text-[11pt] leading-normal relative box-border"
          >
            <div className="w-full">
              <div className="w-full aspect-[757/146] rounded-lg flex items-center justify-center overflow-hidden relative mb-1">
                {/* eslint-disable-next-line  @next/next/no-img-element */}
                <img
                  src={bannerImage || ""}
                  alt="not found pic"
                  className="w-full"
                />
                <div className="absolute left-0 top-0 size-full flex items-center justify-end pr-3 gap-2">
                  <p className="text-white font-bold text-[40px]">
                    {bannerArtistName}
                  </p>
                  <div className="pt-9">
                    <Icon name="logo-xl" />
                  </div>
                  <p className="text-white font-bold text-[40px]">Recoup</p>
                </div>
              </div>
              <div
                dangerouslySetInnerHTML={{
                  __html: addPageBreak(funnelReportContent),
                }}
              />
            </div>
            <SocialSharing />
            <div className="grow w-full flex items-end justify-center mt-10">
              <Icon name="logo-black" />
            </div>
          </div>
        </div>
      )}
      <button
        type="button"
        className="text-purple-dark mt-2"
        onClick={downloadReport}
      >
        {`[Download Full Report PDF]`}
      </button>
    </>
  );
};

export default ReportNextSteps;
