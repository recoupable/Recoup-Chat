import { GenerateSegmentsParams } from "./generateSegments";

const getAnalysisPrompt = ({ fans, prompt }: GenerateSegmentsParams) => {
  const fanCount = fans.length;
  const fanData = fans.map((fan) => ({
    fan_social_id: fan.fan_social_id,
    username: fan.fan_social.username,
    bio: fan.fan_social.bio,
    followerCount: fan.fan_social.followerCount,
    followingCount: fan.fan_social.followingCount,
    comment: fan.latest_engagement_comment?.comment || null,
  }));

  const maxFans = 10000;
  const analysisPrompt = `Analyze the following fan data and generate segment names based on the provided prompt.\n\nFan Data Summary:\n- Total fans: ${fanCount}\n- Fan data: ${JSON.stringify(fanData.slice(0, maxFans), null, 2)}\n\nArtist's specific prompt: ${prompt}\n\nGenerate segment names that align with the artist's requirements and the fan data characteristics.`;
  return analysisPrompt;
};

export default getAnalysisPrompt;
