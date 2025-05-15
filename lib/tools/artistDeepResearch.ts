import { z } from "zod";
import { tool } from "ai";
import { getArtistSocials } from "../api/artist/getArtistSocials";

const TOOL_CHAIN_STEPS = [
  "get_artist_socials - get the socials connected to the artist",
  "perplexity_ask - search for any missing social handles (twitter, instagram, spotify, tiktok)",
  "update_artist_socials - link the discovered socials to the artist",
  "get_spotify_search - get the spotify search results for the artist across all search types (tracks, albums, playlists)",
  "perplexity_ask - loop over this tool until you have all the info required below",
  "generate_txt_file - of the deep research",
  "update_account_info - add the txt as a knowledge base for the artist",
];

const artistDeepResearch = tool({
  description: `
  Conducts comprehensive research on an artist across multiple platforms and generates a detailed report.
  Follows this tool loop:
  <tool_loop>
  ${TOOL_CHAIN_STEPS.join("\n")}
  </tool_loop>

  Research requirements:
  - Spotify: Listener numbers, fan locations, release frequency, top songs, playlist features, collaborators
  - Socials: Follower counts, engagement rates, top content, branding, posting consistency
  - Website: Branding, layout, contact info, mailing list
  - YouTube: Consistency, video quality, viewership, contact info
  - Marketing: Campaign ideas, revenue streams, collaboration opportunities, brand partnerships

Do not stop after initial research - continue with looping over these steps until all the required info is gathered.  
  `,
  parameters: z.object({
    artist_account_id: z.string().describe("Artist account ID to research"),
  }),
  execute: async ({ artist_account_id }) => {
    const data = await getArtistSocials(artist_account_id);
    return {
      artistSocials: data,
      artist_account_id,
      success: true,
      nextSteps: TOOL_CHAIN_STEPS,
    };
  },
});

export default artistDeepResearch;
