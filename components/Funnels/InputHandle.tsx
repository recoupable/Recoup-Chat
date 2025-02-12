import { useAgentsProvider } from "@/providers/AgentsProvider";
import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";
import { X } from "lucide-react";
import { useState } from "react";

const InputHandles = () => {
  const { handles, setHandles } = useFunnelAnalysisProvider();
  const { runAgents } = useAgentsProvider();
  const [removingPlatform, setRemovingPlatform] = useState<string | null>(null);

  const handleContinue = () => {
    runAgents();
  };

  const handleRemove = (id: string) => {
    setRemovingPlatform(id);
    // Wait for animation to complete before removing
    setTimeout(() => {
      const temp = { ...handles };
      delete temp[id];
      setHandles(temp);
      setRemovingPlatform(null);
    }, 300); // Match the duration in the transition class
  };

  // eslint-disable-next-line
  const handleChange = (e: any, id: string) => {
    const temp = { ...handles };
    temp[`${id}`] = e.target.value;
    setHandles(temp);
  };

  return (
    <div className="space-y-2 text-sm">
      {/* eslint-disable-next-line */}
      {Object.entries(handles).map(([id, value]: any) => (
        <div
          key={id}
          className={`
            flex gap-2 items-center
            transition-all duration-300 ease-in-out
            ${removingPlatform === id ? "opacity-0 -translate-x-2" : "opacity-100"}
          `}
        >
          <p>{id.toUpperCase()}: </p>
          <div className="flex-1 flex items-center gap-2">
            <input
              value={value}
              className="flex-1 border rounded-md border-grey-700 px-4 py-1 !outline-none transition-colors focus:border-purple-dark"
              onChange={(e) => handleChange(e, id)}
            />
            <button
              type="button"
              onClick={() => handleRemove(id)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors group"
              title="Remove platform"
              disabled={removingPlatform === id}
            >
              <X className="h-4 w-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
            </button>
          </div>
        </div>
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
