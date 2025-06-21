"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import AgentCard from "../Agents/AgentCard";
import type { Agent } from "../Agents/useAgentData";

// Selected starter agents - handpicked for broad appeal and utility
const STARTER_AGENTS: Agent[] = [
  {
    title: "Social Performance Audit",
    description: "Comprehensive analysis of your social channels to inform digital strategy.",
    prompt: "Give me a complete health check of my artist's social media presence. Which posts are performing best, what are fans saying in the comments, and how does engagement vary across platforms? Could you create a diagram showing our social ecosystem with specific areas to improve?",
    tags: ["Social"]
  },
  {
    title: "Release Optimization", 
    description: "Leverage data to maximize the impact and reach of your next release.",
    prompt: "We're planning our next release. Analyze how our previous releases performed, what fans said about them, and current trends in our genre. Give me recommendations for the ideal release timing, messaging approach, and platform focus to maximize impact.",
    tags: ["Assistant"]
  },
  {
    title: "Fan Engagement Strategy",
    description: "Best practices for high-value fan interactions and community management.",
    prompt: "Review all the comments on our recent Instagram posts and help me develop a response strategy. What questions keep coming up? Which fans should we prioritize engaging with? Create a playbook we can follow for authentic and effective fan interactions.",
    tags: ["Social"]
  }
];

interface StarterAgentsProps {
  isVisible: boolean;
}

export function StarterAgents({ isVisible }: StarterAgentsProps) {
  const { push } = useRouter();

  const handleAgentClick = (agent: Agent) => {
    push(`/chat?q=${encodeURIComponent(agent.prompt)}`);
  };

  const fadeBase = "transition-opacity duration-700 ease-out";
  const fadeStart = "opacity-0";
  const fadeEnd = "opacity-100";

  return (
    <div className={`w-full mt-8 ${fadeBase} ${isVisible ? fadeEnd : fadeStart} transition-delay-[200ms]`}>
      <h3 className="text-lg font-medium mb-4 text-center text-gray-700">
        Starter Agents
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STARTER_AGENTS.map((agent) => (
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