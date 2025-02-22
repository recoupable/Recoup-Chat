import type { Message as AIMessage } from "@ai-sdk/react";

interface ToolCallResult {
  name: string;
  result?: {
    question?: string;
    context?: {
      args?: unknown;
    };
  };
}

interface MessageMetadata {
  toolCall?: ToolCallResult;
}

export interface Message extends AIMessage {
  metadata?: MessageMetadata;
}

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
