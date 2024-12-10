import { Address } from "viem";
import { useEffect, useRef, useState } from "react";
import { Conversation } from "@/types/Stack";
import getConversations from "@/lib/stack/getConversations";
import { useParams, usePathname } from "next/navigation";
import { useUserProvider } from "@/providers/UserProvder";
import trackChatTitle from "@/lib/stack/trackChatTitle";
import { useArtistProvider } from "@/providers/ArtistProvider";

let timer: any = null;
let streamedIndex = 1;

const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { address } = useUserProvider();
  const { conversation } = useParams();
  const conversationRef = useRef(conversation as string);
  const [streamingTitle, setStreamingTitle] = useState({
    title: "",
    isTikTokAnalysis: false,
  });
  const [streaming, setStreaming] = useState(false);
  const { selectedArtist } = useArtistProvider();
  const [allConverstaions, setAllConverstaions] = useState<Conversation[]>([]);
  const pathname = usePathname();
  const isFunnelPage = pathname.includes("/funnels/tiktok-account-analysis");

  useEffect(() => {
    if (address) {
      fetchConversations(address);
    }
  }, [address]);

  useEffect(() => {
    if (!selectedArtist?.id) {
      setConversations(allConverstaions);
      return;
    }
    const filtered = allConverstaions.filter(
      (item: any) => item.metadata.artistId === selectedArtist?.id,
    );
    setConversations(filtered);
  }, [selectedArtist, allConverstaions]);

  const trackNewTitle = async (titlemetadata: any, conversationId: string) => {
    await trackChatTitle(
      address,
      {
        title: titlemetadata,
        isTikTokAnalysis: isFunnelPage,
      },
      conversationId,
      selectedArtist?.id || "",
    );
    clearInterval(timer);
    streamedIndex = 1;
    timer = setInterval(() => {
      if (streamedIndex === titlemetadata.title.length + 1) {
        clearInterval(timer);
        return;
      }
      setStreamingTitle({
        title: titlemetadata.title.slice(0, streamedIndex),
        isTikTokAnalysis: isFunnelPage,
      });
      streamedIndex++;
    }, 50);
    setStreaming(true);
    await fetchConversations(address);
    setStreaming(false);
  };

  const fetchConversations = async (walletAddress: Address) => {
    try {
      const data = await getConversations(walletAddress);
      setAllConverstaions(data);
    } catch (error) {
      console.error("Error fetching initial messages:", error);
      return [];
    }
  };

  return {
    fetchConversations,
    conversations,
    conversationRef,
    conversationId: conversation,
    streamingTitle,
    trackNewTitle,
    streaming,
  };
};

export default useConversations;
