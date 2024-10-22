import { SUGGESTIONS } from "@/lib/consts";
import trackNewMessage from "@/lib/stack/trackNewMessage";
import { Message } from "ai";
import { useState } from "react";
import { Address } from "viem";
import useUser from "./useUser";
import { v4 as uuidV4 } from "uuid";
import { useParams } from "next/navigation";

const useMessages = (conversationId: string) => {
  const { address } = useUser();
  const [suggestions, setSuggestions] = useState(SUGGESTIONS);
  const [currentQuestion, setCurrentQuestion] = useState<Message | null>(null);
  const { conversation: pathId } = useParams();

  const finalCallback = async (
    message: Message,
    lastQuestion?: Message,
    newConversationId?: string,
  ) => {
    const convId = newConversationId || (pathId as string) || conversationId;
    const question = lastQuestion || currentQuestion;
    if (!message.content || !question) return;
    await trackNewMessage(address as Address, question, convId);
    await trackNewMessage(
      address as Address,
      {
        content: message.content.replace(/[^a-zA-Z0-9\s,\.]/g, ""),
        role: message.role,
        id: uuidV4(),
        questionId: question.id,
      },
      convId,
    );
    setCurrentQuestion(null);
    const response = await fetch(`/api/prompts?answer=${message.content}`);
    const data = await response.json();

    setSuggestions(data.questions);
  };

  return {
    finalCallback,
    suggestions,
    setCurrentQuestion,
    currentQuestion,
  };
};

export default useMessages;
