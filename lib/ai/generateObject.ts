import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

const generateObjectAI = async ({
  system,
  prompt,
}: {
  system?: string;
  prompt: string;
}) => {
  console.log("Generating object with system:", system);
  console.log("Generating object with prompt:", prompt);
  const result = await generateObject({
    model: anthropic("claude-3-7-sonnet-20250219"),
    system,
    prompt,
    output: "array",
    schema: z.array(z.string()),
  });
  console.log("Result:", result);
  console.log("result.object:", result.object);

  return result.object;
};

export default generateObjectAI;
