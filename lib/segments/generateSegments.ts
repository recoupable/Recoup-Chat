import generateObjectAI from "@/lib/ai/generateObject";
import { Tables } from "@/types/database.types";

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

    const systemPrompt = `You are an expert music industry analyst specializing in fan segmentation. 
    Your task is to analyze fan data and generate meaningful segment names that would be useful for marketing and engagement strategies.
    
    Guidelines for segment names:
    - Keep names concise and descriptive (2-4 words)
    - Focus on engagement patterns, demographics, or behavioral characteristics
    - Use clear, actionable language that marketers can understand
    - Avoid generic terms like "fans" or "followers"
    - Consider factors like engagement frequency, recency, and intensity
    - Generate 5-10 segment names that cover different aspects of the fan base
    
    The segment names should help artists and managers understand their audience better for targeted marketing campaigns.`;

    const analysisPrompt = `Analyze the following fan data and generate segment names based on the provided prompt.\n\nFan Data Summary:\n- Total fans: ${fanCount}\n- Sample fan data: ${JSON.stringify(fanData.slice(0, 5), null, 2)}\n\nUser's specific prompt: ${prompt}\n\nGenerate segment names that align with the user's requirements and the fan data characteristics.`;

    const result = await generateObjectAI({
      system: systemPrompt,
      prompt: analysisPrompt,
    });
    console.log("generateObjectAI result", result);

    // Return only the first item (segment name) from each sub-array in the result
    return result.map((subArr: string[]) => subArr[0]);
  } catch (error) {
    console.error("Error generating segments:", error);
    throw new Error("Failed to generate segments from fan data");
  }
};
