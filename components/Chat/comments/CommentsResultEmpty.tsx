import React from 'react';
import { MessageCircle } from 'lucide-react';

/**
 * Empty state component shown when no comments are available
 */
const CommentsResultEmpty: React.FC = () => {
  return (
    <div className="flex items-center space-x-3 p-2 rounded bg-gray-50 border border-gray-200 my-1 text-gray-800 w-fit md:rounded-xl">
      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
        <MessageCircle className="h-4 w-4 text-gray-600" />
      </div>
      <div className="flex-grow min-w-0">
        <p className="font-medium text-sm">No Comments Found</p>
        <p className="text-xs text-gray-500 truncate">
          There are no comments to display for this post
        </p>
      </div>
    </div>
  );
};

export default CommentsResultEmpty; 