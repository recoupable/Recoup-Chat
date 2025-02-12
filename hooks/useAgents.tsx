import getHandles from "@/lib/getHandles";
import getExistingHandles from "@/lib/getExistingHandles";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";
import { useUserProvider } from "@/providers/UserProvder";
import { useRouter } from "next/navigation";
import { ArtistRecord } from "@/types/Artist";
import callAgentApi from "@/lib/agent/callAgentApi";
import trackAgentChat from "@/lib/stack/trackAgentChat";

interface AgentData {
  artistId?: string;
  name?: string;
  handles?: Record<string, string>;
}

type SocialHandles = {
  spotify: string;
  twitter: string;
  instagram: string;
  tiktok: string;
};

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

  const lookupProfiles = async (
    funnelType: string,
    scrapingArtist: ArtistRecord | null = null
  ) => {
    if (!isPrepared()) return;
    setHandles({});
    setIsCheckingHandles(true);
    push(`/funnels/${funnelType}`);

    // Get artist to check
    const artist = scrapingArtist || selectedArtist;
    console.log("[lookupProfiles] Artist:", {
      name: artist?.name,
      id: artist?.account_id,
      funnelType,
    });

    // First check existing handles
    const existingHandles = getExistingHandles(artist);
    console.log("[lookupProfiles] Existing handles:", {
      handles: existingHandles,
      count: Object.values(existingHandles).filter((h) => h).length,
    });

    // Get Tavily suggestions
    const handle = artist?.name || "";
    const tavilyHandles = await getHandles(handle);
    console.log("[lookupProfiles] Tavily handles:", {
      handles: tavilyHandles,
      count: Object.values(tavilyHandles).filter((h) => h).length,
    });

    // Merge handles based on what's available
    const mergedHandles: Record<string, string> = {
      spotify: existingHandles.spotify || tavilyHandles.spotify,
      twitter: existingHandles.twitter || tavilyHandles.twitter,
      instagram: existingHandles.instagram || tavilyHandles.instagram,
      tiktok: existingHandles.tiktok || tavilyHandles.tiktok,
    };

    console.log("[lookupProfiles] Final handles:", {
      handles: mergedHandles,
      fromExisting: Object.entries(mergedHandles)
        .filter(([k, v]) => v === existingHandles[k] && v)
        .map(([k]) => k),
      fromTavily: Object.entries(mergedHandles)
        .filter(([k, v]) => v === tavilyHandles[k as keyof SocialHandles] && v)
        .map(([k]) => k),
    });

    if (funnelType === "wrapped") {
      setHandles(mergedHandles);
    } else {
      // Single platform mode - use existing or fall back to Tavily
      setHandles({
        [funnelType]: mergedHandles[funnelType as keyof SocialHandles],
      });
    }
  };

  const runAgents = async (agentdata: AgentData | null = null) => {
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
      agentArtistId
    );
    if (!agentId) return;
    push(`/funnels/${funnelType}/${agentId}`);
    runAgentTimer();
    await trackAgentChat(
      address,
      agentArtistName,
      agentArtistId,
      agentId as string,
      funnelType as string
    );
  };

  return {
    runAgents,
    lookupProfiles,
  };
};

export default useAgents;
