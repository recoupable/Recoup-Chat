import { Address } from "viem";
import { useEffect, useRef, useState } from "react";
import { Conversation } from "@/types/Stack";
import getConversations from "@/lib/stack/getConversations";
import { useParams, useRouter } from "next/navigation";
import { useUserProvider } from "@/providers/UserProvder";
import trackChatTitle from "@/lib/stack/trackChatTitle";
import { useArtistProvider } from "@/providers/ArtistProvider";
import getAiTitle from "@/lib/getAiTitle";
import { v4 as uuidV4 } from "uuid";

let timer: any = null;
let streamedIndex = 1;

const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { address } = useUserProvider();
  const { conversation } = useParams();
  const conversationRef = useRef(conversation as string);
  const [streamingTitle, setStreamingTitle] = useState("");
  const [streaming, setStreaming] = useState(false);
  const { selectedArtist } = useArtistProvider();
  const [allConverstaions, setAllConverstaions] = useState<Conversation[]>([]);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const { push } = useRouter();

  useEffect(() => {
    if (address) {
      fetchConversations(address);
      return;
    }
    setAllConverstaions([]);
  }, [address]);

  useEffect(() => {
    if (!selectedArtist?.artist_id) {
      setConversations(allConverstaions);
      return;
    }
    const filtered = allConverstaions.filter(
      (item: any) => item.metadata.accountId === selectedArtist?.artist_id,
    );
    setConversations(filtered);
  }, [selectedArtist, allConverstaions]);

  const trackGeneralChat = async (
    content: string,
    chatId: string,
    is_funnel_report: boolean,
    active_analaysis_id: string,
  ) => {
    const response = await getAiTitle(content);
    if (response?.error) {
      setQuotaExceeded(true);
      push(`/${uuidV4()}`);
      return;
    }
    setQuotaExceeded(false);
    await trackNewTitle(
      {
        title: response.replaceAll(`\"`, ""),
        is_funnel_report,
        account_id: selectedArtist?.artist_id,
        active_analaysis_id,
      },
      chatId,
    );
    fetchConversations(address);
  };

  const trackNewTitle = async (titlemetadata: any, conversationId: string) => {
    await trackChatTitle(
      address,
      titlemetadata,
      conversationId,
      selectedArtist?.artist_id || "",
    );
    clearInterval(timer);
    streamedIndex = 1;
    timer = setInterval(() => {
      if (streamedIndex === titlemetadata.title.length + 1) {
        clearInterval(timer);
        return;
      }
      setStreamingTitle(titlemetadata.title.slice(0, streamedIndex));
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
    setQuotaExceeded,
    quotaExceeded,
    trackGeneralChat,
    allConverstaions,
  };
};

export default useConversations;
