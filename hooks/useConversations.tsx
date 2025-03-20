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
    return filtered;
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
