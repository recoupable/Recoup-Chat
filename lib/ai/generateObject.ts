import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

const generateObjectAI = async ({
  system,
  prompt,
}: {
  system?: string;
  prompt: string;
}) => {
  const result = await generateObject({
    system,
    model: anthropic("claude-3-7-sonnet-20250219"),
    prompt,
    output: "no-schema",
    mode: "json",
  });

  return result.object;
};

export default generateObjectAI;