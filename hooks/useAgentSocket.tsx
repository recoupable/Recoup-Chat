import getExistingHandles from "@/lib/getExistingHandles";
import getHandles from "@/lib/getHandles";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";
import { useUserProvider } from "@/providers/UserProvder";
import { STEP_OF_ANALYSIS } from "@/types/Funnel";
import { useParams, useRouter } from "next/navigation";
import { v4 as uuidV4 } from "uuid";
import useSockets from "./useSockets";
import { ARTIST_INFO } from "@/types/Artist";

const useAgentSocket = () => {
  const {
    artistHandle,
    setThoughts,
    setUsername,
    handles,
    setHandles,
    setIsCheckingHandles,
    funnelType,
  } = useFunnelAnalysisProvider();
  const { chat_id: chatId } = useParams();
  const { push } = useRouter();
  const { userData, address, isPrepared } = useUserProvider();
  const { setSelectedArtist, selectedArtist } = useArtistProvider();
  const { socketIo, socketId } = useSockets();

  const lookupProfiles = async (
    funnelType: string,
    scrapingArtist: ARTIST_INFO | null = null,
  ) => {
    if (!isPrepared()) return;
    setHandles({});
    setIsCheckingHandles(true);
    const newChatId = uuidV4();
    push(`/funnels/${funnelType}/${newChatId}`);
    const handle =
      scrapingArtist?.artist.name ||
      selectedArtist?.artist.name ||
      artistHandle;
    const socialHandles = await getHandles(handle);
    if (funnelType === "wrapped") {
      setHandles(socialHandles);
      return;
    }
    setHandles({
      [`${funnelType}`]: socialHandles[`${funnelType}`],
    });
  };

  const openAgentSocket = async () => {
    setIsCheckingHandles(false);
    const isWrapped = funnelType === "wrapped";
    if (isWrapped) {
      setThoughts({
        twitter: { status: STEP_OF_ANALYSIS.INITITAL },
        spotify: { status: STEP_OF_ANALYSIS.INITITAL },
        tiktok: { status: STEP_OF_ANALYSIS.INITITAL },
        instagram: { status: STEP_OF_ANALYSIS.INITITAL },
        wrapped: { status: STEP_OF_ANALYSIS.INITITAL },
      });
      const funnels = ["twitter", "spotify", "tiktok", "instagram"];
      funnels.map((funnel) => {
        socketIo.emit(`${funnel.toUpperCase()}_ANALYSIS`, socketId, {
          handle: handles[`${funnel}`].replaceAll("@", "") || "",
          pilot_id: chatId,
          account_id: userData?.account_id,
          address,
          isWrapped,
          existingArtistId: selectedArtist?.artist_id,
        });
      });
    } else {
      setThoughts({
        [`${funnelType}`]: {
          status: STEP_OF_ANALYSIS.INITITAL,
        },
      });
      const agentHandle = handles[`${funnelType}`].replaceAll("@", "") || "";
      setUsername(agentHandle);
      setSelectedArtist({
        ...selectedArtist,
        name: agentHandle,
      } as any);
      socketIo.emit(`${String(funnelType).toUpperCase()}_ANALYSIS`, socketId, {
        handle: agentHandle,
        pilot_id: chatId,
        account_id: userData?.account_id,
        address,
        isWrapped,
        existingArtistId: selectedArtist?.artist_id,
      });
    }
  };

  return {
    socketId,
    openAgentSocket,
    lookupProfiles,
  };
};

export default useAgentSocket;
