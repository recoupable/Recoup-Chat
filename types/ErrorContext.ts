import { Message } from "ai";
import { SerializedError } from "@/lib/errors/serializeError";

export interface ErrorContext {
  email?: string;
  roomId?: string;
  messages?: Message[];
  error: SerializedError;
  accountId?: string; // Added for account_id mapping
} 