import { Address } from "viem";
import { useEffect, useState } from "react";
import getInitialMessages from "@/lib/stack/getInitialMessages";
import { arrangeMessages, flattenMessagePairs } from "@/lib/arrangeMessages";
import useUser from "./useUser";
import { StackMessage } from "@/types/Stack";

const useInitialMessages = () => {
  const [initialMessages, setInitialMessages] = useState<StackMessage[]>([]);
  const { address } = useUser();

  useEffect(() => {
    if (address) {
      fetchInitialMessages(address);
    }
  }, [address]);

  const fetchInitialMessages = async (walletAddress: Address) => {
    try {
      const messages = await getInitialMessages(walletAddress);
      const arrangedMessages = arrangeMessages(messages);
      const flattenedMessages = flattenMessagePairs(arrangedMessages);
      setInitialMessages(flattenedMessages);
      return flattenedMessages;
    } catch (error) {
      console.error("Error fetching initial messages:", error);
      return [];
    }
  };

  return { initialMessages, fetchInitialMessages };
};

export default useInitialMessages;
