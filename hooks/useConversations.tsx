import { Address } from "viem";
import { useEffect, useRef, useState } from "react";
import { Conversation } from "@/types/Stack";
import getConversations from "@/lib/stack/getConversations";
import { useParams, useRouter } from "next/navigation";
import { useUserProvider } from "@/providers/UserProvder";
import trackNewChatEvent from "@/lib/stack/trackNewChatEvent";
import { useArtistProvider } from "@/providers/ArtistProvider";
import getAiTitle from "@/lib/getAiTitle";

let timer: any = null;
let streamedIndex = 1;

const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { address } = useUserProvider();
  const { chat_id: chatId } = useParams();
  const conversationRef = useRef(chatId as string);
  const [streamingTitle, setStreamingTitle] = useState("");
  const [streaming, setStreaming] = useState(false);
  const { selectedArtist } = useArtistProvider();
  const [allConverstaions, setAllConverstaions] = useState<Conversation[]>([]);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const addConversation = (newmetadata: any) => {
    setAllConverstaions([
      { metadata: newmetadata, timestamp: new Date().getTime() } as any,
      ...allConverstaions,
    ]);
  };

  useEffect(() => {
    if (address) {
      fetchConversations(address);
      return;
    }
    setAllConverstaions([]);
  }, [address]);

  useEffect(() => {
    const filtered = allConverstaions.filter(
      (item: any) => item.metadata.accountId === selectedArtist?.account_id,
    );
    setConversations([...filtered]);
  }, [selectedArtist, allConverstaions]);

  const trackGeneralChat = async (content: string, chatId: string) => {
    const response = await getAiTitle(content);
    if (response?.error) {
      setQuotaExceeded(true);
      push("/");
      return;
    }
    setQuotaExceeded(false);
    trackChat({
      title: response.replaceAll(`\"`, ""),
      conversationId: chatId,
      accountId: selectedArtist?.account_id,
    });
  };

  const trackChat = (titlemetadata: any) => {
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
    addConversation(titlemetadata);
    setStreaming(false);
    trackNewChatEvent(address, titlemetadata);
  };

  const fetchConversations = async (walletAddress: Address) => {
    try {
      const data = await getConversations(walletAddress);
      setAllConverstaions(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching initial messages:", error);
      return [];
    }
  };

  return {
    addConversation,
    fetchConversations,
    conversations,
    conversationRef,
    chatId,
    streamingTitle,
    streaming,
    setQuotaExceeded,
    quotaExceeded,
    trackGeneralChat,
    allConverstaions,
    isLoading,
  };
};

export default useConversations;
