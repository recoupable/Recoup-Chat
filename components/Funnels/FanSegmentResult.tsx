import ThoughtSteps from "./ThoughtSteps";
import AnalysisPlan from "./AnalysisPlan";
import Icon from "@/components/Icon";
import ScrapingCaption from "./ScrapingCaption";
import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";
import isScraping from "@/lib/agent/isScraping";
import SocialHandleList from "./SocialHandleList";

const FanSegmentResult = () => {
  const {
    isCheckingHandles,
    handles,
    agentsStatus,
    isInitializing,
    hasError,
    setHandles,
  } = useFunnelAnalysisProvider();

  return (
    <>
      <div
        className={`flex gap-3 ${
          isScraping(agentsStatus) || isCheckingHandles || hasError
            ? "items-center"
            : "items-start"
        }`}
      >
        <div className="border border-gray rounded-full p-2">
          <Icon name="logo-xs" />
        </div>
        <ScrapingCaption />
      </div>
      <div className="pl-11 pt-2">
        {isCheckingHandles ? (
          <>
            {Object.keys(handles).length > 0 && (
              <SocialHandleList
                handles={handles}
                onHandlesChange={setHandles}
                onContinue={() => {}}
              />
            )}
          </>
        ) : (
          <>{isInitializing ? <AnalysisPlan /> : <ThoughtSteps />}</>
        )}
      </div>
    </>
  );
};

export default FanSegmentResult;
