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
    referenceId?: string;
    artistId?: string;
  };
  points: number;
  timestamp: string;
  title?: string;
  isTikTokAnalysis?: boolean;
  reportedActive?: boolean;
};
