import { useEffect, useState } from "react";
import { User } from "lucide-react";

const ImageWithFallback = ({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) => {
  const [imgError, setImgError] = useState(false);
  const [keyValue, setKeyValue] = useState(0);

  // Reset error state when src changes
  useEffect(() => {
    setImgError(false);
    setKeyValue((prev) => prev + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If no src or error loading image, show placeholder
  if (!src || imgError) {
    return (
      <div className="w-full h-full min-w-8 min-h-8">
        <div className={`bg-gray-100 w-full h-full flex items-center justify-center rounded-full border border-gray-200 ${className}`}>
          <User className="w-8 h-8 text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-w-8 min-h-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={keyValue}
        src={src}
        onError={() => setImgError(true)}
        className={`object-cover w-full h-full ${className}`}
        alt="Profile avatar"
      />
    </div>
  );
};

export default ImageWithFallback;
