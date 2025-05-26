import { generateText as generate } from "ai";
import { gateway } from "@vercel/ai-sdk-gateway";

const generateText = async ({ prompt }: { prompt: string }) => {
  const result = await generate({
    model: gateway("anthropic/claude-3.7-sonnet"),
    prompt,
  });

  return result;
};

export default generateText;
