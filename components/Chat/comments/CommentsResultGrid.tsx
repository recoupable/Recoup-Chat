import React from 'react';
import { Comment } from '@/types/Comment';
import MinimalCommentCard from './MinimalCommentCard';

interface CommentsResultGridProps {
  comments: Comment[];
  onCommentClick: (comment: Comment) => void;
}

/**
 * Grid layout for displaying comment cards
 */
const CommentsResultGrid: React.FC<CommentsResultGridProps> = ({ 
  comments, 
  onCommentClick 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1.5">
      {comments.map((comment) => (
        <MinimalCommentCard 
          key={comment.id} 
          comment={comment} 
          onClick={() => onCommentClick(comment)}
        />
      ))}
    </div>
  );
};

export default CommentsResultGrid; 