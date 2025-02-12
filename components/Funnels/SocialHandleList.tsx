import { useState } from "react";
import SocialHandleInput from "./SocialHandleInput";
import { ArrowRight } from "lucide-react";

type Handles = Record<string, string>;

interface SocialHandleListProps {
  handles: Handles;
  onHandlesChange: (handles: Handles) => void;
  onContinue: () => void;
}

const SocialHandleList = ({
  handles,
  onHandlesChange,
  onContinue,
}: SocialHandleListProps) => {
  const [removingPlatform, setRemovingPlatform] = useState<string | null>(null);

  const handleRemove = (platform: string) => {
    setRemovingPlatform(platform);
    setTimeout(() => {
      const newHandles = { ...handles };
      delete newHandles[platform];
      onHandlesChange(newHandles);
      setRemovingPlatform(null);
    }, 300);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    platform: string
  ) => {
    onHandlesChange({
      ...handles,
      [platform]: e.target.value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {Object.entries(handles).map(([platform, value]) => (
          <SocialHandleInput
            key={platform}
            platform={platform}
            value={value}
            isRemoving={removingPlatform === platform}
            onRemove={handleRemove}
            onChange={handleChange}
          />
        ))}
      </div>

      <button
        onClick={onContinue}
        type="button"
        className="
          inline-flex items-center justify-center gap-2
          bg-black text-white rounded-lg
          px-6 py-2
          hover:bg-gray-800
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
          text-sm font-medium
        "
        disabled={Object.keys(handles).length === 0}
      >
        Next
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SocialHandleList;
