import trackChatTitle from "@/lib/stack/trackChatTitle";
import { useUserProvider } from "@/providers/UserProvder";
import { Message } from "ai";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const useAiTitle = (messages: Message[]) => {
  const [title, setTitle] = useState("Recoup");
  const { chat_id, conversation: conversationId } = useParams();
  const { address } = useUserProvider();

  useEffect(() => {
    const fetchTitle = async () => {
      if (!conversationId || messages.length > 1) return;
      setTitle("Recoup");
      const response = await fetch("/api/title", {
        method: "POST",
        body: JSON.stringify({ question: messages[0].content }),
      });
      const data = await response.json();
      const aiTitle = data.title.replaceAll('"', "");
      trackChatTitle(address, aiTitle, conversationId as string);
      setTitle(aiTitle);
    };
    if (chat_id) {
      setTitle("TikTok Analysis Account | Recoup");
      return;
    }
    fetchTitle();
  }, [chat_id, messages, conversationId]);

  return {
    title,
  };
};

export default useAiTitle;
