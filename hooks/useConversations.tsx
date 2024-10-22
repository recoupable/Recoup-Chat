import { Address } from "viem";
import { useEffect, useRef, useState } from "react";
import useUser from "./useUser";
import { Conversation } from "@/types/Stack";
import getConversations from "@/lib/stack/getConversations";
import { useParams } from "next/navigation";

const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { address } = useUser();
  const { conversation } = useParams();
  const conversationRef = useRef(conversation as string);

  useEffect(() => {
    if (address) {
      fetchConversations(address);
    }
  }, [address]);

  const fetchConversations = async (walletAddress: Address) => {
    try {
      const data = await getConversations(walletAddress);
      console.log("ZIAD", data);
      setConversations(data);
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
  };
};

export default useConversations;
