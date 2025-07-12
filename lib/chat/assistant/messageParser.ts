import { Database } from "@/types/database.types";

type Social = Database["public"]["Tables"]["socials"]["Row"];
type PostComment = Database["public"]["Tables"]["post_comments"]["Row"];

// Extended fan data interface with social details and comments
export interface FanDataWithDetails {
  fans: Array<{
    // Social details
    socials: {
      username: string;
      bio: string | null;
      followerCount: number | null;
      followingCount: number | null;
      avatar: string | null;
      profile_url: string;
      region: string | null;
      updated_at: string;
    };
    // Comment data
    comments: {
      comment: string | null;
      commented_at: string;
      post_id: string | null;
      social_id: string | null;
    } | null;
  }>;
}

// Keep the original interface for backward compatibility
export interface FanData {
  fans: Social[];
}

export interface JsonObject {
  json: FanData | FanDataWithDetails;
  start: number;
  end: number;
}

/**
 * Finds and validates JSON objects containing fan data within a text string
 */
export const findJsonObjects = (text: string): JsonObject[] => {
  const results: JsonObject[] = [];
  let depth = 0;
  let start = -1;

  for (let i = 0; i < text.length; i++) {
    if (text[i] === "{") {
      if (depth === 0) {
        start = i;
      }
      depth++;
    } else if (text[i] === "}") {
      depth--;
      if (depth === 0 && start !== -1) {
        try {
          const jsonStr = text.slice(start, i + 1);
          const parsed = JSON.parse(jsonStr);
          // Check for both old and new fan data formats
          if (parsed && Array.isArray(parsed.fans)) {
            results.push({
              json: parsed,
              start,
              end: i + 1,
            });
          }
        } catch {
          // Invalid JSON or not fan data, ignore
        }
      }
    }
  }
  return results;
};
