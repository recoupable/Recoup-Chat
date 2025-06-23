import type React from "react";
import { type Agent } from "../Agents/useAgentData";

interface StarterAgentCardProps {
  agent: Agent;
  onClick: (agent: Agent) => void;
}

const StarterAgentCard: React.FC<StarterAgentCardProps> = ({ agent, onClick }) => {
  return (
    <button
      type="button"
      className="w-full bg-white border border-gray-200/60 rounded-lg px-4 py-3 hover:border-gray-300 hover:shadow-md transition-all duration-200 text-left group hover:-translate-y-px"
      onClick={() => onClick(agent)}
    >
      <div className="text-sm font-semibold text-gray-900 leading-tight group-hover:text-gray-700 transition-colors">
        {agent.title}
      </div>
      <div className="text-gray-600 text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-300 max-h-0 group-hover:max-h-32 overflow-hidden mt-1">
        {agent.description}
      </div>
    </button>
  );
};

export default StarterAgentCard; 