import { Files } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EvidenceButtonsProps {
  evidenceIds: string[];
  label: string;
  onInspectEvidence: (id: string) => void;
}

const EvidenceButtons = ({
  evidenceIds,
  label,
  onInspectEvidence,
}: EvidenceButtonsProps) => {
  if (evidenceIds.length === 0) {
    return (
      <span className="text-xs text-muted-foreground">No sources attached</span>
    );
  }

  return (
    <div
      role="group"
      aria-label={`Sources for ${label}`}
      className="flex flex-wrap items-center gap-1"
    >
      {evidenceIds.map((id, index) => (
        <Button
          key={id}
          type="button"
          variant="ghost"
          size="sm"
          aria-label={`Inspect source ${index + 1} of ${evidenceIds.length} for ${label}`}
          onClick={() => onInspectEvidence(id)}
          className="min-h-11 gap-1.5 rounded-lg px-2 text-xs text-brand-link focus-visible:ring-2"
        >
          {index === 0 && <Files aria-hidden="true" className="size-3.5" />}
          {evidenceIds.length === 1 ? "1 source" : `Source ${index + 1}`}
        </Button>
      ))}
    </div>
  );
};

export default EvidenceButtons;
