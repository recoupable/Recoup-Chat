import React from 'react';
import { MessageCircle } from 'lucide-react';

interface CommentsResultHeaderProps {
  commentCount: number;
  totalCount: number;
}

/**
 * Header component for the comments result section
 */
const CommentsResultHeader: React.FC<CommentsResultHeaderProps> = ({ 
  commentCount, 
  totalCount 
}) => {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-2">
        <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
          <MessageCircle className="h-3 w-3 text-blue-600" />
        </div>
        <span className="font-medium text-sm text-gray-900">Comments</span>
        <span className="text-xs text-gray-500">
          {commentCount} of {totalCount}
        </span>
      </div>
    </div>
  );
};

export default CommentsResultHeader;
