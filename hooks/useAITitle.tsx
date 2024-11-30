import { useChatProvider } from "@/providers/ChatProvider";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const useAITitle = () => {
  const [title, setTitle] = useState("Recoup");
  const { chat_id, converstaion: converstaionId } = useParams();
  const { messages } = useChatProvider();

  useEffect(() => {
    const fetchTitle = async () => {
      if (!converstaionId || messages.length > 1) return;
      setTitle("Recoup");
      const response = await fetch("/api/title", {
        method: "POST",
        body: JSON.stringify({ question: messages[0].content }),
      });
      const data = await response.json();
      setTitle(data.title);
    };
    if (chat_id) setTitle("TikTok Analysis Account | Recoup");
    if (converstaionId) fetchTitle();
  }, [chat_id, messages, converstaionId]);

  return {
    title,
  };
};

export default useAITitle;
