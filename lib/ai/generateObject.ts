import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

const generateObjectAI = async <T>({
  system,
  prompt,
  schema,
}: {
  system?: string;
  prompt: string;
  schema: any;
}) => {
  const result = await generateObject({
    system,
    model: anthropic("claude-3-7-sonnet-20250219"),
    prompt,
    schema,
  });

  return result;
};

export default generateObjectAI;