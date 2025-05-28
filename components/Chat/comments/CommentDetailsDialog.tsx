import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CommentDetailsDialogProps } from "@/types/Comment";
import CommentDetailsDialogHeader from "./CommentDetailsDialogHeader";
import CommentDetailsDialogComment from "./CommentDetailsDialogComment";
import CommentDetailsActions from "./CommentDetailsActions";
import CommentDetailsDialogActions from "./CommentDetailsDialogActions";

/**
 * Dialog component to display detailed comment information
 */
const CommentDetailsDialog: React.FC<CommentDetailsDialogProps> = ({
  comment,
  isOpen,
  onClose,
  onNavigate,
  currentIndex,
  totalComments,
}) => {
  if (!comment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg rounded-xl">
        {/* Dialog header with title and navigation indicator */}
        <CommentDetailsDialogHeader 
          currentIndex={currentIndex}
          totalComments={totalComments}
        />

        {/* Comment information display */}
        <CommentDetailsDialogComment comment={comment} />
        
        {/* Action buttons for the comment */}
        <CommentDetailsActions comment={comment} />

        {/* Dialog navigation buttons */}
        <CommentDetailsDialogActions
          onNavigate={onNavigate}
          currentIndex={currentIndex}
          totalComments={totalComments}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CommentDetailsDialog;
