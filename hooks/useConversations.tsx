import { useEffect, useMemo, useState } from "react";
import { useUserProvider } from "@/providers/UserProvder";
import { useArtistProvider } from "@/providers/ArtistProvider";
import getConversations from "@/lib/getConversations";
import { Conversation } from "@/types/Chat";
import useArtistAgents from "./useArtistAgents";
import { ArtistAgent } from "@/lib/supabase/getArtistAgents";

interface ConversationWithArtist extends Omit<Conversation, 'memories' | 'artist_id'> {
  artist_id?: string;
  memories: Array<{ artist_id: string }> | undefined;
}

interface ArtistAgentWithArtist extends ArtistAgent {
  artist_id?: string;
  memories?: Array<{ artist_id: string }>;
}

type ConversationItem = ConversationWithArtist | ArtistAgentWithArtist;

const useConversations = () => {
  const { userData } = useUserProvider();
  const { selectedArtist } = useArtistProvider();
  const [allConversations, setAllConversations] = useState<Array<ConversationItem>>([]);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { agents } = useArtistAgents();

  const addConversation = (conversation: ConversationItem) => {
    setAllConversations([conversation, ...allConversations]);
  };

  useEffect(() => {
    if (userData) {
      fetchConversations();
      return;
    }
    return () => setAllConversations([]);
  }, [userData, agents]);

  const conversations = useMemo(() => {
    const filtered = allConversations.filter((item) => {
      const isOwnedByCurrentArtist = item.artist_id === selectedArtist?.account_id;
      const hasMessagesFromCurrentArtist = item.memories?.some(
        memory => memory.artist_id === selectedArtist?.account_id
      );
      const isNonEmptyConversation = item.memories && item.memories.length > 0;
      
      return (isOwnedByCurrentArtist || hasMessagesFromCurrentArtist) && isNonEmptyConversation;
    });
    return filtered;
  }, [selectedArtist, allConversations]);

  const fetchConversations = async () => {
    const data = await getConversations(userData.id);
    setAllConversations([...data, ...agents] as ConversationItem[]);
    setIsLoading(false);
  };

  return {
    addConversation,
    fetchConversations,
    conversations,
    setQuotaExceeded,
    quotaExceeded,
    allConversations,
    isLoading,
  };
};

export default useConversations;
