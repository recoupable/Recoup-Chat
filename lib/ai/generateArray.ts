import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

const generateArray = async ({
  system,
  prompt,
}: {
  system?: string;
  prompt: string;
}) => {
  const result = await generateObject({
    model: anthropic("claude-3-7-sonnet-20250219"),
    system,
    prompt,
    output: "array",
    schema: z.array(z.string()),
  });

  return result.object;
};

export default generateArray;
