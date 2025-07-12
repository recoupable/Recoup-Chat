import generateArray from "@/lib/ai/generateArray";
import { Tables } from "@/types/database.types";
import { SEGMENT_SYSTEM_PROMPT } from "../consts";

type SocialFan = Tables<"social_fans">;

interface GenerateSegmentsParams {
  fans: SocialFan[];
  prompt: string;
}

export const generateSegments = async ({
  fans,
  prompt,
}: GenerateSegmentsParams): Promise<string[]> => {
  try {
    const fanCount = fans.length;
    const fanData = fans.map((fan) => ({
      artist_social_id: fan.artist_social_id,
      fan_social_id: fan.fan_social_id,
      latest_engagement: fan.latest_engagement,
      created_at: fan.created_at,
      updated_at: fan.updated_at,
    }));

    const maxFans = 10000;
    const analysisPrompt = `Analyze the following fan data and generate segment names based on the provided prompt.\n\nFan Data Summary:\n- Total fans: ${fanCount}\n- Fan data: ${JSON.stringify(fanData.slice(0, maxFans), null, 2)}\n\nArtist's specific prompt: ${prompt}\n\nGenerate segment names that align with the artist's requirements and the fan data characteristics.`;

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
