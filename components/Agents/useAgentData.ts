import { useEffect, useState } from "react";

// Define Agent type for agent metadata loaded from agents.json
export interface Agent {
  title: string;
  description: string;
  prompt: string;
  tags?: string[];
}

export function useAgentData() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedTag, setSelectedTag] = useState("Recommended");
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<string[]>(["Recommended"]);
  const [showAllTags, setShowAllTags] = useState(false);

  useEffect(() => {
    fetch("/agents.json")
      .then((res) => res.json())
      .then((data: Agent[]) => {
        setAgents(data);
        // Build a unique tag list from all agents, always including 'Recommended' first
        const uniqueTags = Array.from(
          new Set(
            data
              .flatMap((agent: Agent) => agent.tags || [])
              .filter((tag: string) => !!tag)
          )
        );
        const allTags = ["Recommended", ...uniqueTags];
        setTags(Array.from(new Set(allTags)));
        setLoading(false);
      });
  }, []);

  // Find the special "Audience Segmentation" agent
  const funnelAgent = agents.find(
    (agent) => agent.title === "Audience Segmentation"
  );
  // Get all agents except the special card, filtered by the selected tag
  const filteredAgents = agents.filter(
    (agent) =>
      agent.title !== "Audience Segmentation" &&
      (selectedTag === "Recommended" ? true : agent.tags?.includes(selectedTag))
  );
  // Only include the special card if the selected tag is "Research Analyst"
  const gridAgents =
    selectedTag === "Research Analyst"
      ? [...filteredAgents, ...(funnelAgent ? [funnelAgent] : [])]
      : filteredAgents;

  return {
    tags,
    selectedTag,
    setSelectedTag,
    loading,
    showAllTags,
    setShowAllTags,
    gridAgents,
  };
} 