import { z } from "zod";
import { tool } from "ai";

const artistDeepResearch = tool({
  description: `
  Conducts comprehensive research on an artist across multiple platforms and generates a detailed report.
  Follows this tool loop:
  <tool_loop>
    get_artist_socials - get the socials connected to the artist
    perplexity_ask - search for any missing social handles (twitter, instagram, spotify, tiktok)
    update_artist_socials - link the discovered socials to the artist
    perplexity_ask - toop over this tool until you have all the info required below
    generate_txt_file - of the deep research
    update_account_info - add the txt as a knowledge base for the artist
  </tool_loop>

  Research requirements:
  - Spotify: Listener numbers, fan locations, release frequency, top songs, playlist features, collaborators
  - Socials: Follower counts, engagement rates, top content, branding, posting consistency
  - Website: Branding, layout, contact info, mailing list
  - YouTube: Consistency, video quality, viewership, contact info
  - Marketing: Campaign ideas, revenue streams, collaboration opportunities, brand partnerships
  `,
  parameters: z.object({
    artistId: z.string().describe("The ID of the artist to research"),
  }),
});

export default artistDeepResearch;
