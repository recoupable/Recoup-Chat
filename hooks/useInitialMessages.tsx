import { Address } from "viem";
import { useEffect, useState } from "react";
import getInitialMessages from "@/lib/stack/getInitialMessages";
import { sortMessages, flattenMessagePairs } from "@/lib/sortMessages";
import { StackMessage } from "@/types/Stack";
import { useParams } from "next/navigation";
import { useUserProvider } from "@/providers/UserProvder";

const useInitialMessages = () => {
  const [initialMessages, setInitialMessages] = useState<StackMessage[]>([]);
  const { address } = useUserProvider();
  const { conversation: pathId } = useParams();
  const [initialTitle, setInitialTitle] = useState("");

  useEffect(() => {
    if (address) {
      fetchInitialMessages(address);
    }
  }, [address, pathId]);

  const fetchInitialMessages = async (walletAddress: Address) => {
    try {
      const convId = pathId as string;
      if (!convId) return;
      const { messages, title } = await getInitialMessages(
        walletAddress,
        convId,
      );
      setInitialTitle(title);
      const sortedMessages = sortMessages(messages);
      const flattenedMessages = flattenMessagePairs(sortedMessages);
      setInitialMessages(flattenedMessages);
      return flattenedMessages;
    } catch (error) {
      console.error("Error fetching initial messages:", error);
      return;
    }
  };

  return { initialMessages, fetchInitialMessages, initialTitle };
};

export default useInitialMessages;
