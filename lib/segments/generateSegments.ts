import generateArray from "@/lib/ai/generateArray";
import { SEGMENT_SYSTEM_PROMPT } from "../consts";
import getAnalysisPrompt from "./getAnalysisPrompt";
import { SocialFanWithDetails } from "../supabase/social_fans/selectSocialFans";

export interface GenerateSegmentsParams {
  fans: SocialFanWithDetails[];
  prompt: string;
}

export const generateSegments = async ({
  fans,
  prompt,
}: GenerateSegmentsParams): Promise<string[]> => {
  try {
    const analysisPrompt = getAnalysisPrompt({ fans, prompt });

    const result = await generateArray({
      system: SEGMENT_SYSTEM_PROMPT,
      prompt: analysisPrompt,
    });

    // Return only the first item (segment name) from each sub-array in the result
    return result.map((subArr: string[]) => subArr[0]);
  } catch (error) {
    console.error("Error generating segments:", error);
    throw new Error("Failed to generate segments from fan data");
  }
};
