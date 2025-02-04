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
    questionId: string;
    uniqueId: string;
    conversationId: string;
    referenceId: string;
    title: string;
    cached_id: string;
    artistId?: string;
    is_funnel_analysis: boolean;
    funnel_name: string;
    is_funnel_report: boolean;
    active_analaysis_id?: string;
    accountId?: string;
  };
  points: number;
  timestamp: string;
  title?: string;
};
