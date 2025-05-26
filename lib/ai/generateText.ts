import { generateText as generate } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

const generateText = async ({
  system,
  prompt,
}: {
  system?: string;
  prompt: string;
}) => {
  const result = await generate({
    system,
    model: anthropic("claude-3-7-sonnet-20250219"),
    prompt,
  });

  return result;
};

export default generateText;
