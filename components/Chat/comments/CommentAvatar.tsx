import React from "react";

interface CommentAvatarProps {
  username: string;
  avatar?: string | null;
  size?: "sm" | "md";
}

/**
 * Avatar component with image or initials fallback
 */
const CommentAvatar: React.FC<CommentAvatarProps> = ({
  username,
  avatar,
  size = "md",
}) => {
  const initials = username.slice(0, 2).toUpperCase();
  const sizeClasses = size === "md" ? "h-10 w-10" : "h-5 w-5";
  const initialsClasses = size === "md" 
    ? "text-sm from-blue-500 to-purple-600" 
    : "text-[8px] from-gray-300 to-gray-400";

  return (
    <div className={`${sizeClasses} rounded-full overflow-hidden flex-shrink-0 ${size === "md" ? "border border-gray-100" : ""}`}>
      {avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatar}
          alt={username}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <div className={`h-full w-full bg-gradient-to-br ${initialsClasses} flex items-center justify-center text-white font-medium`}>
          {initials}
        </div>
      )}
    </div>
  );
};

export default CommentAvatar; 