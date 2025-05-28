import React from "react";
import { Comment } from "@/types/Comment";
import CommentAvatar from "./CommentAvatar";
import CommentUserInfo from "./CommentUserInfo";
import CommentContent from "./CommentContent";

interface CommentDetailsDialogCommentProps {
  comment: Comment;
}

/**
 * Main component for displaying a comment with user information in the dialog
 */
const CommentDetailsDialogComment: React.FC<
  CommentDetailsDialogCommentProps
> = ({ comment }) => {
  return (
    <div className="space-y-3 my-1">
      {/* User header with avatar and info */}
      <div className="flex items-center space-x-2">
        <CommentAvatar 
          username={comment.username}
          avatar={comment.avatar}
          size="md"
        />
        <CommentUserInfo
          username={comment.username}
          region={comment.region}
          followerCount={comment.follower_count}
        />
      </div>

      {/* User bio if available */}
      {comment.bio && (
        <p className="text-xs text-gray-500 italic">{comment.bio}</p>
      )}

      {/* Comment content with social indicators */}
      <CommentContent 
        text={comment.comment}
        timestamp={comment.commented_at}
      />
    </div>
  );
};

export default CommentDetailsDialogComment;
