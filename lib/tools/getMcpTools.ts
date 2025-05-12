import getSegmentFans from "./getSegmentFans";
import contactTeam from "./contactTeam";
import getArtistSegments from "./getArtistSegments";
import getArtistSocials from "./getArtistSocials";
import getSocialPosts from "./getSocialPosts";
import getPostComments from "./getPostComments";
import perplexityAsk from "./perplexityAsk";
import generateImage from "./generateImage";
import generateMermaidDiagram from "./generateMermaidDiagram";
import createArtist from "./createArtist";
import deleteArtist from "./deleteArtist";
import getSpotifySearch from "./getSpotifySearch";
import updateAccountInfo from "./updateAccountInfo";
import updateArtistSocialsTool from "./updateArtistSocials";
import createTxtFile from "./createTxtFile";

export async function getMcpTools() {
  const tools = {
    contact_team: contactTeam,
    get_artist_segments: getArtistSegments,
    get_segment_fans: getSegmentFans,
    get_artist_socials: getArtistSocials,
    get_social_posts: getSocialPosts,
    get_post_comments: getPostComments,
    perplexity_ask: perplexityAsk,
    generate_image: generateImage,
    generate_mermaid_diagram: generateMermaidDiagram,
    generate_txt_file: createTxtFile,
    create_new_artist: createArtist,
    delete_artist: deleteArtist,
    get_spotify_search: getSpotifySearch,
    update_account_info: updateAccountInfo,
    update_artist_socials: updateArtistSocialsTool,
  };

  return tools;
}
