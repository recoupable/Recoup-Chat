import { useArtistProvider } from "@/providers/ArtistProvider";
import { useUserProvider } from "@/providers/UserProvder";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import useFunnelAnalysisParams from "./useFunnelAnalysisParams";
import getAgent from "@/lib/supabase/getAgent";
import getAgentsStatus from "@/lib/agent/getAgentsStatus";
import isFinishedScraping from "@/lib/agent/isFinishedScraping";
import getAgentsInfoFromStack from "@/lib/stack/getAgentsInfoFromStack";
import getArtistsByAgent from "@/lib/getArtistsByAgent";

let timer: any = null;

const useFunnelAnalysis = () => {
  const params = useFunnelAnalysisParams();
  const { agent_id: agentId } = useParams();
  const { address } = useUserProvider();
  const { getArtists } = useArtistProvider();
  const { push } = useRouter();

  const getAgentTimer: any = async () => {
    if (!agentId) {
      clearInterval(timer);
      return;
    }
    params.setIsLoading(true);
    if (!params.agentsStatus.length) params.setIsCheckingAgentStatus(true);
    params.setIsLoadingAgent(true);
    const { agent, comments } = await getAgent(agentId as string);
    if (!agent) {
      params.setIsCheckingAgentStatus(true);
      params.setIsLoadingAgent(false);
      clearInterval(timer);
      push("/funnels/wrapped");
      return;
    }
    const artistIds = await getArtistsByAgent(agent)
    console.log("ZIAD", artistIds)
    params.setIsLoadingAgent(false);
    getArtists();
    params.setAgent(agent);
    params.setIsCheckingAgentStatus(false);
    const status = getAgentsStatus(agent);
    params.setAgentsStatus(status);
    params.setIsInitializing(false);
    if (isFinishedScraping(status)) {
      params.setIsLoadingSegments(true);
      const { segments } = await getAgentsInfoFromStack(
        agentId as string,
        address,
        comments.slice(0, 500),
      );
      params.setSegments(segments);
      params.setIsLoadingSegments(false);
      clearInterval(timer);
      return;
    }
  };

  const runAgentTimer = () => {
    getAgentTimer();
    timer = setInterval(() => getAgentTimer(timer), 10000);
  };

  useEffect(() => {
    if (agentId && address) {
      params.setIsCheckingHandles(false);
      params.setIsLoading(true);
      runAgentTimer();
    }
    return () => clearInterval(timer);
  }, [agentId, address]);

  return {
    ...params,
    runAgentTimer,
  };
};

export default useFunnelAnalysis;
