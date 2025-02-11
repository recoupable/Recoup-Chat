import { useEffect, useState } from "react";
import { useUserProvider } from "@/providers/UserProvder";
import { useArtistProvider } from "@/providers/ArtistProvider";
import getAgents, { AgentEvent } from "@/lib/stack/getAgents";
import { Address } from "viem";
import { useQuery } from "@tanstack/react-query";

export type Room = {
  topic: string;
  id: string;
  account_id: string;
  memories: Array<{
    artist_id: string;
  }>;
  room_reports: Array<{
    report_id: string;
  }>;
  updated_at: string;
};

async function fetchConversations(
  address: Address,
  account_id: string,
  artist_id: string,
): Promise<Array<Room | AgentEvent>> {
  const response = await fetch(`/api/room/get?account_id=${account_id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch rooms");
  }
  const data = await response.json();
  const filteredRooms = data.rooms.filter(
    (item: Room) =>
      (item as any)?.memories &&
      (item as any)?.memories?.some(
        (memory: { artist_id: string }) => memory.artist_id === artist_id,
      ),
  );
  const rooms = filteredRooms;
  const agents = await getAgents(artist_id, address);
  const aggregated = [...rooms, ...agents];
  return aggregated.sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );
}

const useConversations = () => {
  const { userData, address } = useUserProvider();
  const { selectedArtist } = useArtistProvider();
  const { data, isLoading } = useQuery({
    queryKey: ["conversations", userData, address, selectedArtist?.account_id],
    queryFn: () =>
      fetchConversations(
        address,
        userData.id,
        selectedArtist?.account_id || "",
      ),
    enabled: !!(address && selectedArtist?.account_id && userData?.id),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
  const [conversations, setConversations] = useState<Array<Room | AgentEvent>>(
    [],
  );

  useEffect(() => {
    if (data) setConversations(data);
  }, [data]);

  const addConversation = (conversation: any) => {
    setConversations([conversation, ...conversations]);
  };
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  return {
    addConversation,
    fetchConversations,
    conversations,
    isLoading,
    setQuotaExceeded,
    quotaExceeded,
  };
};

export default useConversations;
