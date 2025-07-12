import { Button } from "@/components/ui/button";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { toast } from "react-toastify";

interface NoSegmentsFoundProps {
  refetch?: () => void;
}

const NoSegmentsFound = ({ refetch }: NoSegmentsFoundProps) => {
  const { selectedArtist } = useArtistProvider();

  const handleCreateSegments = async () => {
    if (!selectedArtist?.account_id) return;
    const artist_account_id = selectedArtist.account_id;
    const prompt = "Segment my fans";
    try {
      const response = await fetch("/api/segments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artist_account_id, prompt }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to generate segments");
      }
      toast.success("Segments generated successfully!");
      if (refetch) refetch();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to generate segments"
      );
      console.error(error);
    }
  };

  return (
    <div className="text-lg text-center py-8 flex flex-col items-center gap-4">
      <div>No segments found for this artist.</div>
      {selectedArtist?.account_id && (
        <Button onClick={handleCreateSegments}>Generate Segments</Button>
      )}
    </div>
  );
};

export default NoSegmentsFound;
