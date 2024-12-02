import trackChatTitle from "@/lib/stack/trackChatTitle";
import { useUserProvider } from "@/providers/UserProvder";
import { Message } from "ai";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

let titleIndex = 1;
let timer: any = null;

const useAiTitle = (messages: Message[]) => {
  const [title, setTitle] = useState("Recoup");
  const { chat_id, conversation: conversationId } = useParams();
  const { address } = useUserProvider();

  const updateTitle = (title: string) => {
    titleIndex = 1;
    clearInterval(timer);
    timer = setInterval(() => {
      setTitle(title.slice(0, titleIndex));
      if (titleIndex === title.length - 1) {
        clearInterval(timer);
        return;
      }
      titleIndex++;
    }, 100);
  };

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
      updateTitle(aiTitle);
    };
    if (chat_id) {
      updateTitle("TikTok Analysis Account | Recoup");
      return;
    }
    fetchTitle();
  }, [chat_id, messages, conversationId]);

  return {
    title,
  };
};

export default useAiTitle;
