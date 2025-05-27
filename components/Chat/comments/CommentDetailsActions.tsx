import React from "react";
import { User, BarChart, Copy } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { Comment } from "@/types/Comment";

interface CommentDetailsActionsProps {
  comment: Comment;
}

const CommentDetailsActions: React.FC<CommentDetailsActionsProps> = ({
  comment,
}) => {
  return (
    <div className="pt-2 flex flex-wrap gap-2">
      <Link
        href={comment.profile_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 px-2 py-1 rounded-xl inline-flex items-center gap-1 transition-colors border border-gray-200"
      >
        <User className="h-3 w-3" />
        Profile
      </Link>
      <Link
        href={comment.post_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 px-2 py-1 rounded-xl inline-flex items-center gap-1 transition-colors border border-gray-200"
      >
        <BarChart className="h-3 w-3" />
        Post
      </Link>
      <button
        onClick={() => {
          toast.success("Copied to clipboard");
          navigator.clipboard.writeText(comment.comment);
        }}
        className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 px-2 py-1 rounded-xl inline-flex items-center gap-1 transition-colors border border-gray-200"
      >
        <Copy className="h-3 w-3" />
        Copy
      </button>
    </div>
  );
};

export default CommentDetailsActions; 