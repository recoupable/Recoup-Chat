import React from "react";
import { Loader } from "lucide-react";

// Create different variations of comment card skeletons
const MinimalCommentCardSkeleton = ({ variant = 1 }: { variant?: number }) => {
  // Adjust width based on variant for more natural appearance
  const usernameWidth = variant === 1 ? "w-16" : variant === 2 ? "w-14" : "w-18";
  const textWidth = variant === 1 ? "w-20" : variant === 2 ? "w-24" : "w-16";
  const secondLineWidth = variant === 1 ? "max-w-[100px]" : variant === 2 ? "max-w-[80px]" : "max-w-[120px]";
  
  return (
    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-xl border border-gray-100 animate-pulse">
      {/* Avatar skeleton */}
      <div className="h-5 w-5 rounded-full overflow-hidden flex-shrink-0 bg-gray-200" />
      
      {/* Content skeleton */}
      <div className="flex-grow min-w-0">
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-start space-x-1">
            <div className={`h-3 ${usernameWidth} bg-gray-200 rounded flex-shrink-0`} />
            <div className={`h-3 ${textWidth} bg-gray-200 rounded`} />
          </div>
          <div className={`h-2.5 w-full ${secondLineWidth} bg-gray-200 rounded`} />
        </div>
      </div>
    </div>
  );
};

const CommentsResultSkeleton = () => {
  return (
    <div className="w-full border border-gray-200 rounded-xl shadow-sm">
      <div className="p-3">
        {/* Header skeleton with loading indicator */}
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center animate-pulse">
              <div className="h-3 w-3 bg-blue-200 rounded-full" />
            </div>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse delay-75" />
            <div className="h-3 w-14 bg-gray-200 rounded animate-pulse delay-150 hidden sm:block" />
          </div>
          
          {/* Loading indicator - responsive */}
          <div className="flex items-center gap-1.5 py-0.5 sm:py-1 px-1.5 sm:px-2 bg-blue-50 border border-blue-100 rounded-xl text-[10px] sm:text-xs text-blue-700">
            <Loader size={10} className="animate-spin" />
            <span className="hidden sm:block">Loading comments</span>
            <span className="sm:hidden">Loading...</span>
          </div>
        </div>
        
        {/* Grid skeleton with same responsive layout and mixed variants */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1.5">
          <MinimalCommentCardSkeleton variant={1} />
          <MinimalCommentCardSkeleton variant={2} />
          <MinimalCommentCardSkeleton variant={3} />
          <MinimalCommentCardSkeleton variant={2} />
          <MinimalCommentCardSkeleton variant={3} />
          <MinimalCommentCardSkeleton variant={1} />
          <MinimalCommentCardSkeleton variant={3} />
          <MinimalCommentCardSkeleton variant={1} />
          <MinimalCommentCardSkeleton variant={2} />
          <MinimalCommentCardSkeleton variant={1} />
          <MinimalCommentCardSkeleton variant={3} />
          <MinimalCommentCardSkeleton variant={2} />
        </div>
      </div>
    </div>
  );
};

export default CommentsResultSkeleton;
