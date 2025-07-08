import insertSocial from "@/lib/supabase/socials/insertSocial";
import getSocialByProfileUrl from "@/lib/supabase/socials/getSocialByProfileUrl";
import { TablesInsert, Tables } from "@/types/database.types";
import { InstagramComment } from "@/lib/apify/handleInstagramCommentsScraper";

/**
 * Gets or creates socials for the given Instagram comment authors and returns them as a map
 * @param comments - Array of Instagram comments
 * @returns Map of username to social record
 */
export default async function getOrCreateSocialsForComments(
  comments: InstagramComment[]
): Promise<Map<string, Tables<"socials">>> {
  // Create a unique set of comment authors
  const uniqueAuthors = Array.from(
    new Map(comments.map(comment => [
      comment.ownerUsername,
      {
        username: comment.ownerUsername,
        profilePicUrl: comment.ownerProfilePicUrl,
        profileUrl: `instagram.com/${comment.ownerUsername}`,
      }
    ])).values()
  );
  
  const socialMap = new Map<string, Tables<"socials">>();
  
  // Process each unique author
  for (const author of uniqueAuthors) {
    try {
      // First, try to get existing social
      let social = await getSocialByProfileUrl(author.profileUrl);
      
      if (!social) {
        // Create new social if it doesn't exist
        const socialToInsert: TablesInsert<"socials"> = {
          username: author.username,
          profile_url: author.profileUrl,
          avatar: author.profilePicUrl,
          bio: null,
          region: null,
          followerCount: null,
          followingCount: null,
        };
        
        social = await insertSocial(socialToInsert);
      }
      
      if (social) {
        socialMap.set(author.username, social);
      }
    } catch (error) {
      console.error(`Error processing social for ${author.username}:`, error);
    }
  }
  
  return socialMap;
}