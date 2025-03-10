import { useEffect, useMemo, useState } from "react";
import { useUserProvider } from "@/providers/UserProvder";
import { useArtistProvider } from "@/providers/ArtistProvider";
import getConversations from "@/lib/getConversations";
import { Conversation } from "@/types/Chat";
import useArtistAgents from "./useArtistAgents";
import { ArtistAgent } from "@/lib/supabase/getArtistAgents";

// Define a more specific type that includes artist_id
interface ConversationWithArtist extends Omit<Conversation, 'memories'> {
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
  const [allConverstaions, setAllConverstaions] = useState<
    Array<ConversationItem>
  >([]);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { agents } = useArtistAgents();

  const addConversation = (conversation: ConversationItem) => {
    setAllConverstaions([conversation, ...allConverstaions]);
  };

  useEffect(() => {
    if (userData) {
      fetchConversations();
      return;
    }
    return () => setAllConverstaions([]);
  }, [userData, agents]);

  const conversations = useMemo(() => {
    const filtered = allConverstaions.filter(
      (item: ConversationItem) => {
        // Check if the item has artist_id directly matching selectedArtist's account_id
        const directArtistMatch = item.artist_id === selectedArtist?.account_id;
        
        // Legacy check for memories containing artist_id that matches selectedArtist's account_id
        const memoryArtistMatch = item.memories && 
          item.memories.some(
            (memory: { artist_id: string }) => 
              memory.artist_id === selectedArtist?.account_id
          );
        
        // Return true if either condition matches
        return directArtistMatch || memoryArtistMatch;
      }
    );
    return filtered;
  }, [selectedArtist, allConverstaions]);

  const fetchConversations = async () => {
    const data = await getConversations(userData.id);
    setAllConverstaions([...data, ...agents] as ConversationItem[]);
    setIsLoading(false);
  };

  return {
    addConversation,
    fetchConversations,
    conversations,
    setQuotaExceeded,
    quotaExceeded,
    allConverstaions,
    isLoading,
  };
};

export default useConversations;
