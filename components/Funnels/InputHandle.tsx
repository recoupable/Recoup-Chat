import { useAgentsProvider } from "@/providers/AgentsProvider";
import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";
import { useState } from "react";
import SocialPlatformInput from "./SocialPlatformInput";

type Handles = Record<string, string>;

const FADE_OUT_ANIMATION_DURATION = 300;

const InputHandles = () => {
  const { handles, setHandles } = useFunnelAnalysisProvider();
  const { runAgents } = useAgentsProvider();
  const [removingPlatform, setRemovingPlatform] = useState<string | null>(null);

  const handleContinue = () => {
    runAgents();
  };

  const removePlatformAfterAnimation = (id: string) => {
    const temp = { ...handles };
    delete temp[id];
    setHandles(temp);
    setRemovingPlatform(null);
  };

  const handleRemove = (id: string) => {
    setRemovingPlatform(id);
    setTimeout(
      () => removePlatformAfterAnimation(id),
      FADE_OUT_ANIMATION_DURATION
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const temp = { ...handles } as Handles;
    temp[`${id}`] = e.target.value;
    setHandles(temp);
  };

  return (
    <div className="space-y-2 text-sm">
      {Object.entries(handles as Handles).map(([id, value]) => (
        <SocialPlatformInput
          key={id}
          id={id}
          value={value}
          isRemoving={removingPlatform === id}
          onRemove={handleRemove}
          onChange={handleChange}
        />
      ))}
      <button
        onClick={handleContinue}
        type="button"
        className="disabled:opacity-50 disabled:cursor-not-allowed bg-black px-4 py-2 text-white rounded-md mt-1 hover:bg-white hover:text-black border-grey-700 border transition-all duration-[200ms]"
        disabled={Object.keys(handles).length === 0}
      >
        Continue
      </button>
    </div>
  );
};

export default InputHandles;
