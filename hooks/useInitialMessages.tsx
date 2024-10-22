import { Address } from "viem";
import { useEffect, useState } from "react";
import getInitialMessages from "@/lib/stack/getInitialMessages";
import { arrangeMessages, flattenMessagePairs } from "@/lib/arrangeMessages";
import useUser from "./useUser";
import { StackMessage } from "@/types/Stack";
import { useParams } from "next/navigation";

const useInitialMessages = (conversationId: string) => {
  const [initialMessages, setInitialMessages] = useState<StackMessage[]>([]);
  const { address } = useUser();
  const { conversation: pathId } = useParams();

  useEffect(() => {
    if (address) {
      fetchInitialMessages(address);
    }
  }, [address]);

  const fetchInitialMessages = async (walletAddress: Address) => {
    try {
      const messages = await getInitialMessages(
        walletAddress,
        (pathId as string) || conversationId,
      );
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
