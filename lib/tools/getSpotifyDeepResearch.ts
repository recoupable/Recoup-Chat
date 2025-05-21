import { z } from "zod";
import { tool } from "ai";
import { getArtistSocials } from "../api/artist/getArtistSocials";

const TOOL_CHAIN_STEPS = [
  "get_artist_socials - get spotify account",
  "get_spotify_artist_top_tracks - get top tracks with popularity scores",
  "get_spotify_artist_albums - albums for artist",
  "get_spotify_album - album from get_spotify_artist_albums. repeat this tool for each album.",
  "<other tools to get engagement info or other missing required items>",
  "create_knowledge_base - generate a txt file with the research and attach it to the artist",
];

const getSpotifyDeepResearch = tool({
  description: `
  Performs deep research on an artist using a Spotify ID.
  Follows this tool loop:
  <tool_loop>
  ${TOOL_CHAIN_STEPS.join("\n")}
  </tool_loop>

  required items in deep research document:
  - popularity info (MANDATORY):
    * Track popularity scores (0-100) for all tracks
    * Average popularity across all tracks
    * Most popular tracks ranked by popularity
    * Popularity trends over time (if available)
  - follower metrics (MANDATORY):
    * Current total follower count
    * Follower growth rate (if available)
    * Follower count by region (if available)
    * Historical follower milestones
  - engagement info
  - tracklist
  - collaborators
  - album art
  - album name

  Keep going until the job is completely solved before ending your turn.
  If you're unsure, use your tools, don't guess.
  Plan thoroughly before every tool call and reflect on the outcome after each tool call.
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

export default getSpotifyDeepResearch;
