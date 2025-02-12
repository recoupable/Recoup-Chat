import { useRouter } from "next/navigation";
import callAgentApi from "@/lib/agent/callAgentApi";
import trackAgentChat from "@/lib/stack/trackAgentChat";
import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";

export const useAgentRunner = () => {
  const {
    funnelType,
    setIsInitializing,
    setAgentsStatus,
    setIsLoading,
    runAgentTimer,
  } = useFunnelAnalysisProvider();
  const { push } = useRouter();

  const runAgent = async (
    address: string,
    artistId: string,
    artistName: string,
    agentHandles: Record<string, string>
  ) => {
    setAgentsStatus([]);
    setIsInitializing(true);
    setIsLoading(true);

    const agentId = await callAgentApi(
      agentHandles,
      funnelType as string,
      artistId
    );

    if (!agentId) return;

    push(`/funnels/${funnelType}/${agentId}`);
    runAgentTimer();

    await trackAgentChat(
      address,
      artistName,
      artistId,
      agentId as string,
      funnelType as string
    );
  };

  return {
    runAgent,
  };
};

export default useAgentRunner;
