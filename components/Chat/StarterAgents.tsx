"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus_Jakarta_Sans } from "next/font/google";
import AgentCard from "../Agents/AgentCard";
import type { Agent } from "../Agents/useAgentData";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500"],
});

interface StarterAgentsProps {
  isVisible: boolean;
}

export function StarterAgents({ isVisible }: StarterAgentsProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const { push } = useRouter();

  useEffect(() => {
    fetch("/api/agent-templates")
      .then((res) => res.json())
      .then((data: Agent[]) => {
        // Filter for agents with "Social", "Assistant", or "Marketing" tags for starter agents
        // or take first 3 agents as fallback
        const starterAgents = data
          .filter(agent => 
            agent.tags?.some(tag => 
              ["Social", "Assistant", "Marketing", "Recommended"].includes(tag)
            )
          )
          .slice(0, 3);
        
        // If we don't have 3 agents with preferred tags, just take the first 3
        const finalAgents = starterAgents.length >= 3 ? starterAgents : data.slice(0, 3);
        
        setAgents(finalAgents);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleAgentClick = (agent: Agent) => {
    push(`/chat?q=${encodeURIComponent(agent.prompt)}`);
  };

  const fadeBase = "transition-opacity duration-700 ease-out";
  const fadeStart = "opacity-0";
  const fadeEnd = "opacity-100";

  const headerStyle = `
    ${plusJakartaSans.className} 
    text-[19px]
    sm:text-[22px]
    lg:text-[28px] 
    leading-[1.3]
    sm:leading-[1.2]
    lg:leading-[1.3] 
    tracking-[-0.25px]
    lg:tracking-[-0.3px] 
    font-medium 
  `;

  if (loading) {
    return (
      <div className={`w-full mt-8 ${fadeBase} ${isVisible ? fadeEnd : fadeStart} transition-delay-[200ms]`}>
        <h3 className={`${headerStyle} mb-4 text-gray-700`}>
          Starter Agents
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 border border-gray-200 rounded-lg p-4 animate-pulse">
              <div className="h-5 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (agents.length === 0) {
    return null;
  }

  return (
    <div className={`w-full mt-8 ${fadeBase} ${isVisible ? fadeEnd : fadeStart} transition-delay-[200ms]`}>
      <h3 className={`${headerStyle} mb-4 text-gray-700`}>
        Starter Agents
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <AgentCard
            key={agent.title}
            agent={agent}
            onClick={() => handleAgentClick(agent)}
          />
        ))}
      </div>
    </div>
  );
}

export default StarterAgents;