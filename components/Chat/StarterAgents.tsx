"use client";

import { useRouter } from "next/navigation";
import { useAgentData, type Agent } from "../Agents/useAgentData";
import AgentCard from "../Agents/AgentCard";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StarterAgentsProps {
  isVisible: boolean;
}

export function StarterAgents({ isVisible }: StarterAgentsProps) {
  const { gridAgents, loading } = useAgentData();
  const { push } = useRouter();

  // Specific agent template IDs for Scheduled Actions
  const targetAgentIds = [
    '9847df8d-d45f-469e-a428-dac6b5dbfa93',
    '71cdeb6c-37c3-4a45-98f2-e01b4288d50d', 
    '1fdfeb1c-eec2-48fa-8596-7c3873218db5'
  ];

  // Find agents by specific IDs, maintain order
  const scheduledActionsAgents = targetAgentIds
    .map(id => gridAgents.find(agent => agent.id === id))
    .filter(Boolean) as Agent[];

  // Fallback to first 3 if specific agents not found
  const agents = scheduledActionsAgents.length > 0 ? scheduledActionsAgents : gridAgents.slice(0, 3);

  const handleAgentClick = (agent: Agent) => {
    push(`/chat?q=${encodeURIComponent(agent.prompt)}`);
  };

  if (loading || gridAgents.length === 0) return null;

  return (
    <TooltipProvider>
      <div 
        className={`w-full mt-8 transition-opacity duration-500 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs bg-black text-white px-2 py-1 rounded-full font-medium">
            NEW
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <h3 className="text-lg leading-[1.3] tracking-[-0.25px] font-semibold text-black font-plus_jakarta_sans cursor-help">
                Scheduled Actions
              </h3>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-sm text-xs p-2">
              <div className="space-y-1">
                <p className="font-medium">Examples:</p>
                <p>• &ldquo;Send weekly emails every Monday&rdquo;</p>
                <p>• &ldquo;Check trending sounds daily at 9am&rdquo;</p>
                <p>• Type &ldquo;show my scheduled actions&rdquo; to manage</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {agents.map((agent: Agent, index: number) => (
            <div
              key={agent.title}
              className="transition-all duration-300 ease-out"
              style={{
                transitionDelay: `${index * 100}ms`
              }}
            >
              <AgentCard agent={agent} onClick={() => handleAgentClick(agent)} />
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}

export default StarterAgents;