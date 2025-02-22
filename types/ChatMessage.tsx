import { Message } from "ai";

export type MessageRole = "user" | "assistant" | "system" | "data";

export interface BaseMessage extends Message {
  role: MessageRole;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface UserMessage extends BaseMessage {
  role: "user";
}

export interface AssistantMessage extends BaseMessage {
  role: "assistant";
  toolCall?: {
    name: string;
    arguments: Record<string, unknown>;
  };
}

export interface SystemMessage extends BaseMessage {
  role: "system";
}

export interface DataMessage extends BaseMessage {
  role: "data";
}

export type ChatMessage =
  | UserMessage
  | AssistantMessage
  | SystemMessage
  | DataMessage;

export interface MessageProps {
  message: ChatMessage;
  index: number;
}
