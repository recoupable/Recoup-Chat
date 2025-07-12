import { generateText as generate } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { ANTHROPIC_MODEL } from "../consts";

const generateText = async ({
  system,
  prompt,
}: {
  system?: string;
  prompt: string;
}) => {
  const result = await generate({
    system,
    model: anthropic(ANTHROPIC_MODEL),
    prompt,
  });

  return result;
};

export default generateText;
