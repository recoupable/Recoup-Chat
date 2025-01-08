import getAggregatedSocials from "@/lib/agent/getAggregatedSocials";
import getExistingHandles from "@/lib/getExistingHandles";
import getHandles from "@/lib/getHandles";
import socketIo from "@/lib/socket/client";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";
import { useUserProvider } from "@/providers/UserProvder";
import { STEP_OF_ANALYSIS } from "@/types/TikTok";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";

const useAgentSocket = () => {
  const [socketId, setSocketId] = useState<any>(undefined);
  const { chat_id: chatId } = useParams();
  const {
    artistHandle,
    setIsLoading,
    getAnalysis,
    setThoughts,
    thoughts,
    funnelType,
  } = useFunnelAnalysisProvider();
  const { push } = useRouter();
  const { userData, address, isPrepared } = useUserProvider();
  const { setSelectedArtist, selectedArtist } = useArtistProvider();

  useEffect(() => {
    socketIo.on("connect", () => {
      setSocketId(socketIo.id);
    });
  }, []);

  useEffect(() => {
    if (!chatId || !thoughts) return;
    socketIo.removeAllListeners();
    socketIo.on(chatId as string, async (dataGot) => {
      if (typeof dataGot?.status === "number") {
        setIsLoading(true);
        if (dataGot.status === STEP_OF_ANALYSIS.CREATED_ARTIST) {
          if (funnelType === "wrapped") {
            setSelectedArtist({
              ...dataGot.extra_data,
              ...selectedArtist,
              artist_social_links: getAggregatedSocials([
                ...dataGot?.extra_data?.artist_social_links,
                ...(selectedArtist?.artist_social_links || []),
              ]),
              isWrapped: true,
            });
          } else {
            setSelectedArtist(dataGot.extra_data);
          }
        }

        if (dataGot.status === STEP_OF_ANALYSIS.FINISHED) await getAnalysis();
        const tempThoughts: any = { ...thoughts };
        tempThoughts[`${dataGot.funnel_type}`].status = dataGot?.status;
        tempThoughts[`${dataGot.funnel_type}`].progress = dataGot?.progress;
        setThoughts(tempThoughts);
      }
    });
  }, [chatId, thoughts]);

  const openAgentSocket = async (funnelType: string) => {
    if (!isPrepared()) return;
    const newChatId = uuidV4();
    if (funnelType === "wrapped") {
      setThoughts({
        twitter: { status: STEP_OF_ANALYSIS.INITITAL },
        spotify: { status: STEP_OF_ANALYSIS.INITITAL },
        tiktok: { status: STEP_OF_ANALYSIS.INITITAL },
        instagram: { status: STEP_OF_ANALYSIS.INITITAL },
      });
      setIsLoading(true);
      push(`/funnels/${funnelType}/${newChatId}`);
      const existingHandles = getExistingHandles(selectedArtist);
      const handles = await getHandles(selectedArtist?.name || artistHandle);
      const funnels = ["twitter", "spotify", "tiktok", "instagram"];
      funnels.map((funnel) => {
        socketIo.emit(`${funnel.toUpperCase()}_ANALYSIS`, socketId, {
          handle:
            existingHandles[`${funnel}`] ||
            handles[`${funnel}`].replaceAll("@", "") ||
            artistHandle,
          chat_id: newChatId,
          account_id: userData?.id,
          address,
          isWrapped: true,
        });
      });
    } else {
      setThoughts({
        [`${funnelType}`]: {
          status: STEP_OF_ANALYSIS.INITITAL,
        },
      });
      socketIo.emit(`${funnelType.toUpperCase()}_ANALYSIS`, socketId, {
        handle: artistHandle,
        chat_id: newChatId,
        account_id: userData?.id,
        address,
      });
      push(`/funnels/${funnelType}/${newChatId}`);
    }
  };

  return {
    socketId,
    openAgentSocket,
  };
};

export default useAgentSocket;
