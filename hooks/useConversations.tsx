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
  const [allConverstaions, setAllConverstaions] = useState<
    Array<Conversation | ArtistAgent>
  >([]);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { agents } = useArtistAgents();

  const addConversation = (conversation: any) => {
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
      (item: Conversation | ArtistAgent) =>
        (item as any)?.memories &&
        (item as any)?.memories?.some(
          (memory: { artist_id: string }) =>
            memory.artist_id === selectedArtist?.account_id,
        ),
    );
    return filtered;
  }, [selectedArtist, allConverstaions]);

  const fetchConversations = async () => {
    const data = await getConversations(userData.id);
    setAllConverstaions([...data, ...agents]);
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
