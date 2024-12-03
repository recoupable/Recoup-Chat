import { useState } from "react";

const ImageWithFallback = ({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleError = () => {
    setCurrentSrc("https://i.imgur.com/QCdc8Ai.jpg");
  };

  return (
    <div className="flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={currentSrc}
        onError={handleError}
        className={`${className} object-cover w-full`}
        alt="not found pic"
      />
    </div>
  );
};

export default ImageWithFallback;