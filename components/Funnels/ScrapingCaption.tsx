import Completion from "./Completion";
import Loading from "@/components/Loading";
import isFinishedScraping from "@/lib/agent/isFinishedScraping";
import isScraping from "@/lib/agent/isScraping";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";

const ScrapingCaption = () => {
  const { artistHandle, funnelName, funnelType, thoughts, isCheckingHandles } =
    useFunnelAnalysisProvider();
  const { selectedArtist } = useArtistProvider();

  return (
    <div className="text-sm !w-[calc(100vw-95px)] md:w-full">
      {isCheckingHandles ? (
        <div className="flex gap-2 items-center">
          Verifying @{selectedArtist?.artist.name || artistHandle}
          ’s Social Handles...
          <Loading />
        </div>
      ) : (
        <>
          {isFinishedScraping(thoughts) && <Completion />}
          {isScraping(thoughts) && (
            <div className="flex gap-2 items-center">
              Scraping @
              {funnelType === "wrapped"
                ? selectedArtist?.artist.name || artistHandle
                : artistHandle}
              ’s {funnelName}...
              <Loading />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ScrapingCaption;
