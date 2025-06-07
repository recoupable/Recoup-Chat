import { Eval } from "braintrust";

// Mock Spotify search result for testing
interface MockSpotifyResult {
  success: boolean;
  artists?: Array<{ id: string; name: string }>;
  message?: string;
}

// Simple custom scorer to check tool output structure
const ToolStructureScore = ({ output, expected }: { output: MockSpotifyResult; expected: string }): { name: string; score: number } => {
  if (!output) return { name: "Tool Structure", score: 0 };
  
  // Check if success field exists
  if (!('success' in output)) return { name: "Tool Structure", score: 0 };
  
  // If successful, check if expected data exists
  if (output.success === true) {
    if (expected === "has_artists" && output.artists && output.artists.length > 0) {
      return { name: "Tool Structure", score: 1 };
    }
    if (expected === "empty_ok") {
      return { name: "Tool Structure", score: 1 }; // Non-existent artist should still succeed
    }
  }
  
  const score = output.success ? 0.5 : 0;
  return { name: "Tool Structure", score };
};

// Mock Spotify search function for testing
async function mockSpotifySearch(query: string): Promise<MockSpotifyResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Mock responses for known artists
  const knownArtists = ["taylor swift", "drake", "billie eilish"];
  const queryLower = query.toLowerCase();
  
  if (knownArtists.some(artist => queryLower.includes(artist))) {
    return {
      success: true,
      artists: [{ id: "mock-id", name: query }]
    };
  }
  
  // Return success but empty results for unknown artists
  return {
    success: true,
    artists: []
  };
}

Eval("Tool Data Validation", {
  data: () => [
    {
      input: "Taylor Swift",
      expected: "has_artists"
    },
    {
      input: "Drake", 
      expected: "has_artists"
    },
    {
      input: "Billie Eilish",
      expected: "has_artists"
    },
    {
      input: "nonexistentartist123xyz",
      expected: "empty_ok"
    },
  ],
  task: async (input: string): Promise<MockSpotifyResult> => {
    try {
      const result = await mockSpotifySearch(input);
      return result;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Tool execution failed"
      };
    }
  },
  scores: [ToolStructureScore],
}); 