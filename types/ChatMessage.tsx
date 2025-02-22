import type { Message } from "@ai-sdk/react";

export type MessageRole = Message["role"];

export interface BaseMessage extends Message {
  role: MessageRole;
  content: string;
}

export interface UserMessage extends BaseMessage {
  role: "user";
}

export interface AssistantMessage extends BaseMessage {
  role: "assistant";
}

export interface SystemMessage extends BaseMessage {
  role: "system";
}

export interface DataMessage extends BaseMessage {
  role: "data";
}

export type ChatMessage = Message;

export interface MessageProps {
  message: ChatMessage;
  index: number;
}
