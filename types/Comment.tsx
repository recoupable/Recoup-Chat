/**
 * Types for Comments functionality
 */

// Core Comment interface
export interface Comment {
  id: string;
  post_id: string;
  social_id: string;
  comment: string;
  commented_at: string;
  username: string;
  avatar: string | null;
  profile_url: string;
  post_url: string;
  region: string | null;
  bio: string | null;
  follower_count: number | null;
  following_count: number | null;
}

// Pagination information
export interface CommentPagination {
  total_count: number;
  page: number;
  limit: number;
  total_pages: number;
}

// API response structure
export interface CommentResponse {
  status: "success" | "error";
  comments: Comment[];
  pagination: CommentPagination;
}

// Full response data including success flag
export interface CommentsResultData {
  success: boolean;
  status: "success" | "error";
  comments: Comment[];
  pagination: CommentPagination;
  message?: string;
}

// Props for the CommentDetailsDialog component
export interface CommentDetailsDialogProps {
  comment: Comment | null; 
  isOpen: boolean; 
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  currentIndex: number;
  totalComments: number;
}

// Props for the CommentsResult component
export interface CommentsResultProps {
  result: CommentsResultData;
}

// Props for minimal comment card
export interface MinimalCommentCardProps {
  comment: Comment;
  onClick: () => void;
} 