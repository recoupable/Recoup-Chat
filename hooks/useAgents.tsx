import { useArtistProvider } from "@/providers/ArtistProvider";
import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";
import { useUserProvider } from "@/providers/UserProvder";
import { useRouter } from "next/navigation";
import { ArtistRecord } from "@/types/Artist";
import useHandleLookup from "./useHandleLookup";
import useAgentRunner from "./useAgentRunner";

interface AgentData {
  artistId?: string;
  name?: string;
  handles?: Record<string, string>;
}

const useAgents = () => {
  const { setHandles, setIsCheckingHandles, handles } =
    useFunnelAnalysisProvider();
  const { push } = useRouter();
  const { address, isPrepared } = useUserProvider();
  const { selectedArtist } = useArtistProvider();
  const { lookupHandles } = useHandleLookup();
  const { runAgent } = useAgentRunner();

  const lookupProfiles = async (
    funnelType: string,
    scrapingArtist: ArtistRecord | null = null
  ) => {
    if (!isPrepared()) return;
    setHandles({});
    setIsCheckingHandles(true);
    push(`/funnels/${funnelType}`);

    const artist = scrapingArtist || selectedArtist;
    const newHandles = await lookupHandles(artist, funnelType);
    setHandles(newHandles);
  };

  const runAgents = async (agentdata: AgentData | null = null) => {
    const agentArtistId = agentdata?.artistId || selectedArtist?.account_id;
    const agentArtistName = agentdata?.name || selectedArtist?.name || "";
    const agentArtistHandles = agentdata?.handles || handles;

    if (!agentArtistId) return;

    await runAgent(address, agentArtistId, agentArtistName, agentArtistHandles);
  };

  return {
    runAgents,
    lookupProfiles,
  };
};

export default useAgents;
