import { Address } from "viem";
import { useEffect, useState } from "react";
import useUser from "./useUser";
import { Conversation, StackMessage } from "@/types/Stack";
import getConversations from "@/lib/stack/getConversations";

const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { address } = useUser();

  useEffect(() => {
    if (address) {
      fetchConversations(address);
    }
  }, [address]);

  const fetchConversations = async (walletAddress: Address) => {
    try {
      const data = await getConversations(walletAddress);
      setConversations(data);
    } catch (error) {
      console.error("Error fetching initial messages:", error);
      return [];
    }
  };

  return { fetchConversations, conversations };
};

export default useConversations;
