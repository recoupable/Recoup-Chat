import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";
import { useAgentsProvider } from "@/providers/AgentsProvider";
import VerifyCard from "./VerifyCard";
import SocialHandleList from "./SocialHandleList";
import Loading from "../Loading";

const VerifyingSocials = () => {
  const { isCheckingHandles, handles, setHandles } =
    useFunnelAnalysisProvider();
  const { runAgents } = useAgentsProvider();

  if (!isCheckingHandles) return null;

  return (
    <main className="grow py-8 px-4">
      <div className="max-w-md mx-auto">
        <VerifyCard>
          {Object.keys(handles).length > 0 ? (
            <SocialHandleList
              handles={handles}
              onHandlesChange={setHandles}
              onContinue={runAgents}
            />
          ) : (
            <div className="flex items-center justify-center py-8">
              <Loading />
            </div>
          )}
        </VerifyCard>
      </div>
    </main>
  );
};

export default VerifyingSocials;
