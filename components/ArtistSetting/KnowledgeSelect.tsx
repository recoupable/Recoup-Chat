import { useArtistProvider } from "@/providers/ArtistProvider";
import { Plus } from "lucide-react";

const KnowledgeSelect = () => {
  const { baseRef, knowledgeUploading, handleKnowledgesSelected } =
    useArtistProvider();

  return (
    <>
      <button
        type="button"
        className="w-full flex gap-2 items-center border-grey rounded-md p-2 border-[1px]"
        onClick={() => baseRef.current?.click()}
        disabled={knowledgeUploading}
      >
        <Plus className="size-5 md:size-8" />
        <p className="text-xs md:text-sm">Click or Drop Files</p>
      </button>
      <input
        type="file"
        multiple
        hidden
        ref={baseRef}
        onChange={handleKnowledgesSelected}
      />
    </>
  );
};

export default KnowledgeSelect;
