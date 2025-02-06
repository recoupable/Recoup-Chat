import { useFunnelReportProvider } from "@/providers/FunnelReportProvider";
import Icon from "../Icon";

const ReportHTML = () => {
  const { bannerImage, bannerArtistName, funnelRawReportContent } =
    useFunnelReportProvider();

  return (
    <div className="w-full segment-report">
      <div className="w-full aspect-[757/146] rounded-lg flex items-center justify-center overflow-hidden relative mb-2">
        {/* eslint-disable-next-line  @next/next/no-img-element */}
        <img src={bannerImage || ""} alt="not found pic" className="w-full" />
        <div className="absolute left-0 top-0 size-full flex items-center justify-end pr-3 gap-2">
          <p className="text-white font-bold text-[40px]">{bannerArtistName}</p>
          <Icon name="logo-xl" />
          <p className="text-white font-bold text-[40px]">Recoup</p>
        </div>
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: funnelRawReportContent,
        }}
      />
    </div>
  );
};

export default ReportHTML;
