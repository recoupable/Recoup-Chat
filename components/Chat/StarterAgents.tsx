"use client";

import { useRouter } from "next/navigation";
import { useAgentData, type Agent } from "../Agents/useAgentData";
import AgentCard from "../Agents/AgentCard";

interface StarterAgentsProps {
  isVisible: boolean;
}

export function StarterAgents({ isVisible }: StarterAgentsProps) {
  const { gridAgents, loading } = useAgentData();
  const { push } = useRouter();

  // Select first 3 agents with preferred tags, fallback to first 3
  const preferred = gridAgents.filter((agent: Agent) => 
    agent.tags?.some((tag: string) => ["Social", "Assistant", "Marketing", "Recommended"].includes(tag))
  );
  const starterAgents = (preferred.length >= 3 ? preferred : gridAgents).slice(0, 3);

  const handleAgentClick = (agent: Agent) => {
    push(`/chat?q=${encodeURIComponent(agent.prompt)}`);
  };

  if (loading || starterAgents.length === 0) return null;

  return (
    <div className={`w-full mt-8 transition-opacity duration-700 ease-out transition-delay-[200ms] ${
      isVisible ? "opacity-100" : "opacity-0"
    }`}>
      <h3 className="text-[19px] sm:text-[22px] lg:text-[28px] leading-[1.3] sm:leading-[1.2] lg:leading-[1.3] tracking-[-0.25px] lg:tracking-[-0.3px] font-medium mb-4 text-gray-700 font-plus_jakarta_sans">
        Starter Agents
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {starterAgents.map((agent) => (
          <AgentCard key={agent.title} agent={agent} onClick={() => handleAgentClick(agent)} />
        ))}
      </div>
    </div>
  );
}

export default StarterAgents;