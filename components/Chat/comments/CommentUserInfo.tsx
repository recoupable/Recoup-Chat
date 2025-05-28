import React from "react";
import formatFollowerCount from "@/lib/utils/formatFollowerCount";

interface CommentUserInfoProps {
  username: string;
  region?: string | null;
  followerCount?: number | null;
}

/**
 * Component for displaying user profile information
 */
const CommentUserInfo: React.FC<CommentUserInfoProps> = ({
  username,
  region,
  followerCount,
}) => {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center flex-wrap gap-1">
        <h3 className="font-medium text-sm text-gray-900">
          @{username}
        </h3>
        {region && (
          <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full text-gray-600">
            {region}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500">
        {followerCount !== null && followerCount !== undefined && (
          <span>
            {formatFollowerCount(followerCount)} followers
          </span>
        )}
      </div>
    </div>
  );
};

export default CommentUserInfo; 