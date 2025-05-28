import { useRouter } from "next/navigation";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useAgentsProvider } from "@/providers/AgentsProvider";
import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";
import AgentTags from "./AgentTags";
import AgentCard from "./AgentCard";
import { useAgentData } from "./useAgentData";
import type { Agent } from "./useAgentData";

const Agents = () => {
  const { push } = useRouter();
  const { selectedArtist } = useArtistProvider();
  const { lookupProfiles } = useAgentsProvider();
  const { setIsLoading } = useFunnelAnalysisProvider();
  const {
    tags,
    selectedTag,
    setSelectedTag,
    loading,
    showAllTags,
    setShowAllTags,
    gridAgents,
  } = useAgentData();

  const handleAgentClick = (agent: Agent) => {
    push(
      `/chat?q=${encodeURIComponent(agent.prompt)}`
    );
  };

  const handleClick = (funnelName: string) => {
    if (selectedArtist) {
      setIsLoading(true);
      lookupProfiles(funnelName);
      return;
    }
    push(`/funnels/${funnelName}`);
  };

  return (
    <div className="max-w-full md:max-w-[calc(100vw-200px)] grow py-6 px-2 md:px-10">
      <p className="text-center md:text-left font-plus_jakarta_sans_bold text-3xl mb-3">
        Agents
      </p>
      <p className="text-base md:text-lg text-gray-400 text-center md:text-left mb-4 font-light font-inter">
        <span className="sm:hidden">Smarter label teams, powered by agents.</span>
        <span className="hidden sm:inline">Unlock the potential of your roster with intelligent, task-focused agents.</span>
      </p>
      <div className="mt-2">
        <AgentTags
          tags={tags}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          showAllTags={showAllTags}
          setShowAllTags={setShowAllTags}
        />
      </div>
      <div className="mt-16" />
      {loading ? (
        <div className="text-center text-gray-400">Loading agents...</div>
      ) : gridAgents.length === 0 ? (
        <div className="text-center text-gray-400">No agents found for this tag.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 px-2 md:px-10 md:max-w-[calc(100vw-200px)]">
          {gridAgents.map((agent) => (
            <AgentCard
              key={agent.title}
              agent={agent}
              onClick={
                agent.title === "Audience Segmentation"
                  ? () => handleClick("wrapped")
                  : () => handleAgentClick(agent)
              }
            />
          ))}
        </div>
      )}
      <div className="mb-16" />
    </div>
  );
};

export default Agents;
