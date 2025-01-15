import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import socketIo from "@/lib/socket/client";
import { STEP_OF_ANALYSIS } from "@/types/TikTok";
import { useArtistProvider } from "@/providers/ArtistProvider";
import getAggregatedSocials from "@/lib/agent/getAggregatedSocials";

const useSockets = () => {
  const { thoughts, setIsLoading, getAnalysis, setThoughts, funnelType } =
    useFunnelAnalysisProvider();
  const { chat_id: chatId } = useParams();
  const [socketId, setSocketId] = useState<any>(undefined);
  const { selectedArtist, setSelectedArtist } = useArtistProvider();

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
          if (funnelType === "wrapped" && selectedArtist) {
            setSelectedArtist({
              ...dataGot.extra_data,
              ...selectedArtist,
              artist_social_links: getAggregatedSocials([
                ...(selectedArtist?.artist_social_links || []),
                ...dataGot?.extra_data?.artist_social_links,
              ]),
              isWrapped: true,
            });
          } else setSelectedArtist(dataGot.extra_data);
        }

        if (
          dataGot.status === STEP_OF_ANALYSIS.FINISHED ||
          dataGot.status === STEP_OF_ANALYSIS.WRAPPED_COMPLETED
        )
          await getAnalysis();
        if (!dataGot?.funnel_type) return;
        const tempThoughts: any = { ...thoughts };
        tempThoughts[`${dataGot.funnel_type}`] = {
          status: dataGot?.status,
          progress: dataGot?.progress,
        };
        setThoughts({ ...tempThoughts });
      }
    });
  }, [chatId, thoughts]);

  return {
    socketIo,
    socketId,
  };
};

export default useSockets;
