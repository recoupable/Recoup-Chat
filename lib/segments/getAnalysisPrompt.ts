import { GenerateSegmentsParams } from "./generateSegments";

const getAnalysisPrompt = ({ fans, prompt }: GenerateSegmentsParams) => {
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
  return analysisPrompt;
};

export default getAnalysisPrompt;
