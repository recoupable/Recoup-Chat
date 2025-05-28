import type React from "react";

interface AgentTagsProps {
  tags: string[];
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  showAllTags: boolean;
  setShowAllTags: (show: boolean) => void;
}

const AgentTags: React.FC<AgentTagsProps> = ({
  tags,
  selectedTag,
  setSelectedTag,
}) => (
  <div className="flex flex-wrap gap-2 mb-8 items-center justify-center md:justify-start">
    {tags.map((tag) => (
      <button
        key={tag}
        type="button"
        className={`px-3 py-1 rounded-full border text-sm transition-colors ${
          selectedTag === tag
            ? "bg-black text-white border-black"
            : "bg-white text-black border-gray-200 hover:bg-gray-100"
        }`}
        onClick={() => setSelectedTag(tag)}
      >
        {tag}
      </button>
    ))}
  </div>
);

export default AgentTags; 