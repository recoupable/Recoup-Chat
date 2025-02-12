import SocialHandleInput from "./SocialHandleInput";
import NextButton from "./NextButton";
import { useHandleManager } from "@/hooks/useHandleManager";

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
  const { removingPlatform, handleRemove, handleChange } = useHandleManager({
    handles,
    onHandlesChange,
  });

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

      <div className="flex justify-end">
        <NextButton
          onContinue={async () => await onContinue()}
          disabled={Object.keys(handles).length === 0}
        />
      </div>
    </div>
  );
};

export default SocialHandleList;
