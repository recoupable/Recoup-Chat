import serverClient from "../serverClient";
import { Tables } from "@/types/database.types";

type PostComment = Tables<"post_comments">;
type PostCommentInsert = Partial<PostComment>;

export const insertPostComments = async (
  comments: PostCommentInsert[]
): Promise<PostComment[]> => {
  const { data, error } = await serverClient
    .from("post_comments")
    .insert(comments)
    .select();

  if (error) {
    console.error("Error inserting post comments:", error);
    throw error;
  }

  return data;
};