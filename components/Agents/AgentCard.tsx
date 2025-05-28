import type React from "react";

interface Agent {
  title: string;
  description: string;
  prompt: string;
  tags?: string[];
  status?: string;
}

interface AgentCardProps {
  agent: Agent;
  onClick: (agent: Agent) => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onClick }) => (
  <button
    type="button"
    className="w-full text-left bg-white border border-gray-200 rounded-lg p-4 shadow-none hover:shadow-md hover:-translate-y-1 hover:bg-gray-50 transition-all"
    onClick={() => onClick(agent)}
  >
    <div className="text-lg mb-1 font-medium">{agent.title}</div>
    <div className="text-gray-400 text-sm font-normal font-inter">{agent.description}</div>
  </button>
);

export default AgentCard; 