import React from 'react';

interface CommentsResultErrorProps {
  message?: string;
}

/**
 * Error state component shown when comments cannot be loaded
 */
const CommentsResultError: React.FC<CommentsResultErrorProps> = ({ 
  message = 'Failed to load comments' 
}) => {
  return (
    <div className="flex items-center space-x-3 p-2 rounded bg-red-50 border border-red-200 my-1 text-red-800 w-fit md:rounded-xl">
      <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center overflow-hidden shrink-0">
        <span className="text-sm font-medium text-red-600">×</span>
      </div>
      <div className="flex-grow min-w-0">
        <p className="font-medium text-sm">Error Loading Comments</p>
        <p className="text-xs text-red-600 truncate">
          {message}
        </p>
      </div>
    </div>
  );
};

export default CommentsResultError; 