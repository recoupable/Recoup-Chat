import React from "react";
import CommentSocialIndicators from "./CommentSocialIndicators";

interface CommentContentProps {
  text: string;
  timestamp: string;
}

/**
 * Component for displaying the comment text and social indicators
 */
const CommentContent: React.FC<CommentContentProps> = ({
  text,
  timestamp,
}) => {
  return (
    <div className="rounded-xl border-blue-100">
      <p className="p-3 pl-1 rounded-xl rounded-bl-none bg-gradient-to-br from-blue-100 to-blue-200 text-gray-800 font-normal whitespace-pre-wrap text-sm font-inter">
        {text}
      </p>
      
      {/* Social media indicators */}
      <CommentSocialIndicators timestamp={timestamp} />
    </div>
  );
};

export default CommentContent; 