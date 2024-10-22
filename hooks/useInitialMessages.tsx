import { Address } from "viem";
import { useEffect, useState } from "react";
import getInitialMessages from "@/lib/stack/getInitialMessages";
import { sortMessages, flattenMessagePairs } from "@/lib/sortMessages";
import useUser from "./useUser";
import { StackMessage } from "@/types/Stack";
import { useParams } from "next/navigation";

const useInitialMessages = () => {
  const [initialMessages, setInitialMessages] = useState<StackMessage[]>([]);
  const { address } = useUser();
  const { conversation: pathId } = useParams();

  useEffect(() => {
    if (address) {
      fetchInitialMessages(address);
    }
  }, [address, pathId]);

  const fetchInitialMessages = async (walletAddress: Address) => {
    try {
      const convId = pathId as string;
      if (!convId) return;
      const messages = await getInitialMessages(walletAddress, convId);
      const sortedMessages = sortMessages(messages);
      const flattenedMessages = flattenMessagePairs(sortedMessages);
      setInitialMessages(flattenedMessages);
      return flattenedMessages;
    } catch (error) {
      console.error("Error fetching initial messages:", error);
      return;
    }
  };

  return { initialMessages, fetchInitialMessages };
};

export default useInitialMessages;
