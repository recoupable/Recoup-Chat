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

const AgentCard: React.FC<AgentCardProps> = ({ agent, onClick }) => {
  // Define action tags that should be displayed in cards
  const actionTags = ["Deep Research", "Send Report", "Email Outreach", "Scheduled Action", "Creative Content"];
  
  // Filter agent tags to only show action tags
  const displayedActionTags = agent.tags?.filter(tag => 
    actionTags.includes(tag)
  ) || [];

  return (
    <button
      type="button"
      className="w-full min-h-32 md:h-44 bg-gray-50 border border-gray-100 rounded-lg p-4 md:p-6 hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all duration-200 text-left group relative flex flex-col"
      onClick={() => onClick(agent)}
    >
      {/* Action tag - fully rounded pills */}
      {displayedActionTags.length > 0 && (
        <div className="flex-shrink-0 mb-2 md:mb-3">
          <span className="inline-block text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full font-medium border border-gray-200">
            {displayedActionTags[0]}
          </span>
        </div>
      )}
      
      {/* Title - lighter weight */}
      <div className="flex-shrink-0 mb-2 md:mb-3">
        <h3 className="text-base md:text-lg font-medium text-gray-900 leading-tight group-hover:text-black transition-colors">
          {agent.title}
        </h3>
      </div>
      
      {/* Description - more compact */}
      <div className="flex-1 text-gray-600 text-sm leading-relaxed line-clamp-3 overflow-hidden">
        {agent.description}
      </div>
    </button>
  );
};

export default AgentCard; 