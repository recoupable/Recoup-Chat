import { Message } from "ai";

export type StackMessage = Message & {
  questionId?: string;
};

export type Conversation = {
  id: string;
  name: string;
};
