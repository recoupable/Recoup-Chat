import getSegmentFans from "./getSegmentFans";
import contactTeam from "./contactTeam";
import getArtistSegments from "./getArtistSegments";
import getArtistSocials from "./getArtistSocials";
import getSocialPosts from "./getSocialPosts";
import getPostComments from "./getPostComments";
import { getPerplexityTools } from "./getPerplexityTools";

export async function getMcpTools() {
  const perplexityTools = await getPerplexityTools();

  const tools = {
    contact_team: contactTeam,
    get_artist_segments: getArtistSegments,
    get_segment_fans: getSegmentFans,
    get_artist_socials: getArtistSocials,
    get_social_posts: getSocialPosts,
    get_post_comments: getPostComments,
    ...perplexityTools,
  };

  return tools;
}
