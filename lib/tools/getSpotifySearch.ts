import { z } from "zod";
import { tool } from "ai";
import { SpotifySearchResponse } from "../../types/spotify";

// Supported Spotify search types
const SPOTIFY_TYPES = [
  "album",
  "artist",
  "playlist",
  "track",
  "show",
  "episode",
  "audiobook",
] as const;

// Pluralized result keys
export type SpotifyType = (typeof SPOTIFY_TYPES)[number];
export type SpotifyResultKey = `${SpotifyType}s`;

// Tool return type: only includes keys for requested types
export type GetSpotifySearchResult =
  | ({ success: true } & Partial<Record<SpotifyResultKey, unknown>>)
  | { success: false; message: string };

// Zod schema for parameter validation
const schema = z.object({
  name: z.string().min(1, "Search query is required"),
  type: z.array(z.enum(SPOTIFY_TYPES)).min(1, "At least one type is required"),
  limit: z.number().min(1).max(50).optional().default(5),
});

const getSpotifySearch = tool({
  description:
    "Search for Spotify items (artist, album, track, playlist, etc.) by name. Returns results for each requested type.",
  parameters: schema,
  // Type the execute function to return only the requested result keys
  execute: async ({
    name,
    type,
    limit = 5,
  }): Promise<GetSpotifySearchResult> => {
    try {
      const url = new URL("https://api.recoupable.com/api/spotify/search");
      url.searchParams.append("q", name);
      url.searchParams.append("type", type.join(","));
      url.searchParams.append("limit", limit.toString());

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = (await response.json()) as SpotifySearchResponse;
      // Only return the sections for the requested types
      const result: Partial<Record<SpotifyResultKey, unknown>> = {};
      for (const t of type) {
        const key = `${t}s` as SpotifyResultKey;
        if (data[key]) {
          result[key] = data[key];
        }
      }
      return {
        success: true,
        ...result,
      };
    } catch (error) {
      console.error("Error searching Spotify:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to search Spotify",
      };
    }
  },
});

export default getSpotifySearch;
