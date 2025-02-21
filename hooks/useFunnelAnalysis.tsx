import { useArtistProvider } from "@/providers/ArtistProvider";
import { useUserProvider } from "@/providers/UserProvder";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import useFunnelAnalysisParams from "./useFunnelAnalysisParams";
import getAgent from "@/lib/agent/getAgent";
import getAgentsStatus from "@/lib/agent/getAgentsStatus";
import isFinishedScraping from "@/lib/agent/isFinishedScraping";
import getArtistsByAgent from "@/lib/getArtistsByAgent";
import { useQueryClient } from "@tanstack/react-query";

let timer: NodeJS.Timeout | null = null;

const useFunnelAnalysis = () => {
  const params = useFunnelAnalysisParams();
  const { agent_id: agentId } = useParams();
  const { address } = useUserProvider();
  const { getArtists, artists, selectedArtist } = useArtistProvider();
  const { push } = useRouter();
  const queryClient = useQueryClient();

  const getAgentTimer = async () => {
    if (!agentId) {
      if (timer) clearInterval(timer);
      return;
    }
    if (!params.agentsStatus.length) params.setIsCheckingAgentStatus(true);
    params.setIsLoading(true);
    params.setIsLoadingAgent(true);
    const { agent } = await getAgent(agentId as string);
    if (!agent) {
      params.setIsCheckingAgentStatus(false);
      params.setIsLoadingAgent(false);
      if (timer) clearInterval(timer);
      push("/funnels/wrapped");
      return;
    }
    params.setIsLoadingAgent(false);
    getArtists();
    params.setAgent(agent);
    params.setIsCheckingAgentStatus(false);
    const status = getAgentsStatus(agent);
    params.setAgentsStatus(status);
    params.setIsInitializing(false);
    if (isFinishedScraping(status)) {
      if (selectedArtist?.account_id) {
        await queryClient.invalidateQueries({
          queryKey: ["segments", selectedArtist.account_id],
        });
      }
      const artistIds = await getArtistsByAgent(agent);
      params.setIsLoadingAgent(false);
      const selectedArtistId = artistIds.find(
        (ele: string) => ele === selectedArtist?.account_id
      );
      const existingArtist = artists.find((artist) =>
        artistIds.includes(artist.account_id)
      );
      getArtists(selectedArtistId || existingArtist?.account_id);
      if (timer) clearInterval(timer);
      return;
    }
  };

  const runAgentTimer = () => {
    getAgentTimer();
    timer = setInterval(() => getAgentTimer(), 10000);
  };

  useEffect(() => {
    if (agentId && address && artists.length) {
      params.setIsCheckingHandles(false);
      params.setIsLoading(true);
      runAgentTimer();
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [agentId, address, artists.length]);

  return {
    ...params,
    runAgentTimer,
    isLoadingAgent: params.isLoadingAgent,
  };
};

export default useFunnelAnalysis;
