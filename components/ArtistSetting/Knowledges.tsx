import { useArtistProvider } from "@/providers/ArtistProvider";
import { X } from "lucide-react";
import Icon from "../Icon";
import getKnowledgeIcon from "@/lib/getKnowledgeIcon";

const Knowledges = () => {
  const { knowledges: knowledges_info, handleDeleteKnowledge } =
    useArtistProvider();
  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {knowledges_info.map((base: any, index: number) => (
        <div
          className="flex gap-2 justify-between items-center w-full"
          key={index}
        >
          <button
            type="button"
            className="flex items-center gap-1"
            onClick={() => window.open(base.url, "_blank")}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Icon name={getKnowledgeIcon(base.type) as any} />
            <p className="truncate max-w-[200px] text-sm">{base.name}</p>
          </button>
          <button type="button" onClick={() => handleDeleteKnowledge(index)}>
            <X className="size-4" />
          </button>
        </div>
      ))}
    </>
  );
};

export default Knowledges;
