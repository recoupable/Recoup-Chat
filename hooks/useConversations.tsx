import { useEffect, useMemo, useState } from "react";
import { useUserProvider } from "@/providers/UserProvder";
import { useArtistProvider } from "@/providers/ArtistProvider";
import getConversations from "@/lib/getConversations";
import { Conversation } from "@/types/Chat";
import useArtistAgents from "./useArtistAgents";
import { ArtistAgent } from "@/lib/supabase/getArtistAgents";

const useConversations = () => {
  const { userData } = useUserProvider();
  const { selectedArtist } = useArtistProvider();
  const [allConversations, setAllConversations] = useState<
    Array<Conversation | ArtistAgent>
  >([]);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { agents } = useArtistAgents();

  const addConversation = (conversation: Conversation | ArtistAgent) => {
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
    const filtered = allConversations.filter(
      (item: Conversation | ArtistAgent) =>
        'artist_id' in item && item.artist_id === selectedArtist?.account_id
    );
    
    // Sort by updated_at in descending order (most recent first)
    return filtered.sort((a, b) => {
      if ('updated_at' in a && 'updated_at' in b) {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
      return 0;
    });
  }, [selectedArtist, allConversations]);

  const fetchConversations = async () => {
    const data = await getConversations(userData.id);
    setAllConversations([...data, ...agents]);
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
