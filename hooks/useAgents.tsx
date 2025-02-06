import getHandles from "@/lib/getHandles";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";
import { useUserProvider } from "@/providers/UserProvder";
import { useRouter } from "next/navigation";
import { ArtistRecord } from "@/types/Artist";
import callAgentApi from "@/lib/agent/callAgentApi";
import trackAgentChat from "@/lib/stack/trackAgentChat";
import { useConversationsProvider } from "@/providers/ConverstaionsProvider";

const useAgents = () => {
  const {
    handles,
    setHandles,
    setIsCheckingHandles,
    funnelType,
    setIsInitializing,
    setAgentsStatus,
    setIsLoading,
    runAgentTimer,
  } = useFunnelAnalysisProvider();
  const { push } = useRouter();
  const { address, isPrepared } = useUserProvider();
  const { selectedArtist } = useArtistProvider();
  const { addConversation } = useConversationsProvider();

  const lookupProfiles = async (
    funnelType: string,
    scrapingArtist: ArtistRecord | null = null,
  ) => {
    if (!isPrepared()) return;
    setHandles({});
    setIsCheckingHandles(true);
    push(`/funnels/${funnelType}`);
    const handle = scrapingArtist?.name || selectedArtist?.name || "";
    const socialHandles: any = await getHandles(handle);
    if (funnelType === "wrapped") {
      setHandles(socialHandles);
      return;
    }
    setHandles({
      [`${funnelType}`]: socialHandles[`${funnelType}`],
    });
  };

  const runAgents = async (agentdata: any = null) => {
    const agentArtistId = agentdata?.artistId || selectedArtist?.account_id;
    const agentArtistName = agentdata?.name || selectedArtist?.name || "";
    const agentArtistHandles = agentdata?.handles || handles;
    if (!agentArtistId) return;
    setAgentsStatus([]);
    setIsInitializing(true);
    setIsLoading(true);
    const agentId = await callAgentApi(
      agentArtistHandles,
      funnelType as string,
      agentArtistId,
    );
    if (!agentId) return;
    push(`/funnels/${funnelType}/${agentId}`);
    runAgentTimer();
    addConversation({
      conversationId: agentId,
      accountId: agentArtistId,
      title: `${new String(funnelType as string).toUpperCase()} Analysis: ${agentArtistName}`,
      is_funnel_analysis: true,
      funnel_name: funnelType,
    });
    await trackAgentChat(
      address,
      agentArtistName,
      agentArtistId,
      agentId as string,
      funnelType as string,
    );
  };

  return {
    runAgents,
    lookupProfiles,
  };
};

export default useAgents;
