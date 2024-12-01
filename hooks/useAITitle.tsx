import { useChatProvider } from "@/providers/ChatProvider";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const useAITitle = () => {
  const [title, setTitle] = useState("Recoup");
  const { chat_id, conversation: conversationId } = useParams();
  const { messages } = useChatProvider();

  useEffect(() => {
    const fetchTitle = async () => {
      if (!conversationId || messages.length > 1) return;
      setTitle("Recoup");
      const response = await fetch("/api/title", {
        method: "POST",
        body: JSON.stringify({ question: messages[0].content }),
      });
      const data = await response.json();
      setTitle(data.title.replaceAll('"', ""));
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

export default useAITitle;
