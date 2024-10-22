import { StackMessage } from "@/types/Stack";

interface MessagePair {
  user: StackMessage;
  assistant?: StackMessage;
}

export const sortMessages = (messages: StackMessage[]): MessagePair[] => {
  const messagePairs: MessagePair[] = [];
  const assistantMap: Map<string, StackMessage> = new Map();

  messages.forEach((message) => {
    if (message.role === "assistant" && message.questionId) {
      assistantMap.set(message.questionId, message);
    }
  });

  messages.forEach((message) => {
    if (message.role === "user") {
      const pair: MessagePair = { user: message };
      const assistantMessage = assistantMap.get(message.id);
      if (assistantMessage) {
        pair.assistant = assistantMessage;
        assistantMap.delete(message.id);
      }
      messagePairs.push(pair);
    }
  });

  return messagePairs;
};

export const flattenMessagePairs = (
  messagePairs: MessagePair[],
): StackMessage[] => {
  const flatMessages: StackMessage[] = [];

  messagePairs.forEach((pair) => {
    flatMessages.push(pair.user);
    if (pair.assistant) {
      flatMessages.push(pair.assistant);
    }
  });

  return flatMessages;
};
