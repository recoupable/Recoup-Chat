import serverClient from "../serverClient";
import { Tables } from "@/types/database.types";

type PostComment = Tables<"post_comments">;

interface SelectPostCommentsParams {
  postUrls?: string[];
  postIds?: string[];
  socialIds?: string[];
}

export const selectPostComments = async (
  params?: SelectPostCommentsParams
): Promise<PostComment[]> => {
  let query = serverClient.from("post_comments").select(`
    *,
    post:posts(*),
    social:socials(*)
  `);

  if (params?.postUrls && params.postUrls.length > 0) {
    // First get post IDs for the given URLs
    const { data: posts } = await serverClient
      .from("posts")
      .select("id")
      .in("post_url", params.postUrls);
    
    if (posts && posts.length > 0) {
      const postIds = posts.map((post: { id: string }) => post.id);
      query = query.in("post_id", postIds);
    } else {
      // If no posts found for the URLs, return empty array
      return [];
    }
  }

  if (params?.postIds && params.postIds.length > 0) {
    query = query.in("post_id", params.postIds);
  }

  if (params?.socialIds && params.socialIds.length > 0) {
    query = query.in("social_id", params.socialIds);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error selecting post comments:", error);
    throw error;
  }

  return data || [];
};

export default selectPostComments;