import React from 'react';
import { CommentsResultProps } from '@/types/Comment';
import { useCommentsResult } from '@/components/hooks/useCommentsResult';
import CommentDetailsDialog from './CommentDetailsDialog';
import CommentsResultError from './CommentsResultError';
import CommentsResultEmpty from './CommentsResultEmpty';
import CommentsResultHeader from './CommentsResultHeader';
import CommentsResultGrid from './CommentsResultGrid';

/**
 * Main component for displaying a list of comments with detailed view functionality
 */
export const CommentsResult: React.FC<CommentsResultProps> = ({ result }) => {
  // Use the comments result hook
  const {
    selectedComment,
    dialogOpen,
    currentIndex,
    totalComments,
    handleCommentClick,
    handleCloseDialog,
    handleNavigation
  } = useCommentsResult(result.comments);
  
  // Handle error state
  if (!result.success || result.status === 'error') {
    return <CommentsResultError message={result.message} />;
  }

  // Handle empty state
  if (result.comments.length === 0) {
    return <CommentsResultEmpty />;
  }

  return (
    <div className="w-full border border-gray-200 rounded-xl shadow-sm">
      <div className="p-3">
        {/* Compact header */}
        <CommentsResultHeader 
          commentCount={result.comments.length} 
          totalCount={result.pagination.total_count} 
        />
        
        {/* Responsive grid layout - mobile: 1 col, iPad: 2 cols, desktop: 3 cols */}
        <CommentsResultGrid 
          comments={result.comments}
          onCommentClick={handleCommentClick}
        />
      </div>
      
      {/* Comment details dialog */}
      <CommentDetailsDialog 
        comment={selectedComment}
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        onNavigate={handleNavigation}
        currentIndex={currentIndex}
        totalComments={totalComments}
      />
    </div>
  );
};
