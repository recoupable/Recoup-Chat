import { Message } from "ai";

export type StackMessage = Message & {
  questionId?: string;
};

export type Conversation = {
  address: string;
  event: string;
  metadata: {
    id: string;
    role: string;
    content: string;
    conversationId: string;
    questionId: string;
    uniqueId: string;
  };
  title?: string;
  points: number;
  timestamp: string;
};
