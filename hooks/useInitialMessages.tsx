import { Address } from "viem";
import { useEffect, useState } from "react";
import getInitialMessages from "@/lib/stack/getInitialMessages";
import { arrangeMessages, flattenMessagePairs } from "@/lib/arrangeMessages";
import useUser from "./useUser";
import { StackMessage } from "@/types/Stack";
import { useParams, usePathname } from "next/navigation";

const useInitialMessages = (conversationId: string) => {
  const [initialMessages, setInitialMessages] = useState<StackMessage[]>([]);
  const { address } = useUser();
  const { conversation: pathId } = useParams();
  const pathname = usePathname();

  const isNewChat = pathname === "/";

  useEffect(() => {
    if (address) {
      fetchInitialMessages(address);
    }
  }, [address, pathId]);

  useEffect(() => {
    if (isNewChat) setInitialMessages([]);
  }, [isNewChat]);

  const fetchInitialMessages = async (walletAddress: Address) => {
    try {
      const convId = (pathId as string) || conversationId;
      if (!convId) return null;
      const messages = await getInitialMessages(walletAddress, convId);
      const arrangedMessages = arrangeMessages(messages);
      const flattenedMessages = flattenMessagePairs(arrangedMessages);
      setInitialMessages(flattenedMessages);
      return flattenedMessages;
    } catch (error) {
      console.error("Error fetching initial messages:", error);
      return null;
    }
  };

  return { initialMessages, fetchInitialMessages };
};

export default useInitialMessages;
