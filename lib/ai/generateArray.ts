import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { ANTHROPIC_MODEL } from "../consts";

export interface GenerateArrayResult {
  segmentName: string;
  fans: string[];
}

const generateArray = async ({
  system,
  prompt,
}: {
  system?: string;
  prompt: string;
}): Promise<GenerateArrayResult[]> => {
  const result = await generateObject({
    model: anthropic(ANTHROPIC_MODEL),
    system,
    prompt,
    output: "array",
    schema: z.object({
      segmentName: z.string().describe("Segment name."),
      fans: z.array(z.string()).describe(
        `Array of fan_social_id included in the segment. 
          Do not make this up.
          Only use the actual fan_social_id from the fan data prompt input.`
      ),
    }),
  });

  return result.object;
};

export default generateArray;
