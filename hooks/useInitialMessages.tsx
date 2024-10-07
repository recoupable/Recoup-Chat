import { Message } from "ai";
import { Address } from "viem";
import { useEffect, useState } from "react";
import getInitialMessages from "@/lib/stack/getInitialMessages";
import { usePrivy } from "@privy-io/react-auth";

const useInitialMessages = () => {
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const { user } = usePrivy();
  const address = user?.wallet?.address as Address;

  useEffect(() => {
    if (address) {
      fetchInitialMessages(address);
    }
  }, [address]);

  const fetchInitialMessages = async (walletAddress: Address) => {
    try {
      const messages = await getInitialMessages(walletAddress);
      setInitialMessages(messages);
    } catch (error) {
      console.error("Error fetching initial messages:", error);
    }
  };

  return { initialMessages };
};

export default useInitialMessages;
