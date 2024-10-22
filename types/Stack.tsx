import { Message } from "ai";

export type StackMessage = Message & {
  questionId?: string;
};
