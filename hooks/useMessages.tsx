import { SUGGESTIONS } from "@/lib/consts";
import trackNewMessage from "@/lib/stack/trackNewMessage";
import { Message } from "ai";
import { useState } from "react";
import { Address } from "viem";
import useUser from "./useUser";
import { v4 as uuidV4 } from "uuid";

const useMessages = () => {
  const { address } = useUser();
  const [suggestions, setSuggestions] = useState(SUGGESTIONS);
  const [currentQuestion, setCurrentQuestion] = useState<Message | null>(null);

  const finalCallback = async (message: Message) => {
    console.log("ZIAD finalCallback", message, currentQuestion);
    if (!message.content || !currentQuestion) return;
    await trackNewMessage(address as Address, currentQuestion);
    await trackNewMessage(address as Address, {
      content: message.content.replace(/[^a-zA-Z0-9\s,\.]/g, ""),
      role: message.role,
      id: uuidV4(),
      questionId: currentQuestion.id,
    });
    setCurrentQuestion(null);
    const response = await fetch(`/api/prompts?answer=${message.content}`);
    const data = await response.json();

    setSuggestions(data.questions);
  };

  console.log("ZIAD CURRENT QUESTION", currentQuestion);

  return {
    finalCallback,
    suggestions,
    setCurrentQuestion,
    currentQuestion,
  };
};

export default useMessages;
