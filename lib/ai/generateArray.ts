import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { ANTHROPIC_MODEL } from "../consts";

const generateArray = async ({
  system,
  prompt,
}: {
  system?: string;
  prompt: string;
}) => {
  const result = await generateObject({
    model: anthropic(ANTHROPIC_MODEL),
    system,
    prompt,
    output: "array",
    schema: z.array(z.string()),
  });

  return result.object;
};

export default generateArray;
