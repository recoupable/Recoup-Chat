import { z } from "zod";
import { AI_MODEL } from "../consts";

const ChatModelsSchema = z.enum([`gpt-3.5-turbo`, `gpt-4o`, AI_MODEL]);

export const ChatSettingsSchema = z.object({
  model: ChatModelsSchema,
  temperature: z.number().min(0).max(1),
  maxTokens: z.number().min(1).max(2048),
  systemMessage: z.string().min(1).max(3000), // approx 600 tokens
});
