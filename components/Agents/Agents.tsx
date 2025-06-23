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
    <div className="max-w-full md:max-w-[calc(100vw-200px)] grow py-8 px-6 md:px-12">
      <p className="text-center md:text-left font-plus_jakarta_sans_bold text-3xl mb-4">
        Agents
      </p>
      <p className="text-lg text-gray-500 text-center md:text-left mb-8 font-light font-inter max-w-2xl">
        <span className="sm:hidden">Smarter label teams, powered by agents.</span>
        <span className="hidden sm:inline">Unlock the potential of your roster with intelligent, task-focused agents.</span>
      </p>
      <div className="mb-8">
        <AgentTags
          tags={tags}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          showAllTags={showAllTags}
          setShowAllTags={setShowAllTags}
        />
      </div>
      <div className="mt-12" />
      {loading ? (
        <div className="text-center text-gray-400 py-12">Loading agents...</div>
      ) : gridAgents.length === 0 ? (
        <div className="text-center text-gray-400 py-12">No agents found for this tag.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
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
