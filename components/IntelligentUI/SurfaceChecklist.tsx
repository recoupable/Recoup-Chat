import { useId } from "react";
import { Check, CircleDashed, ScanEye } from "lucide-react";
import type { ChecklistComponent } from "@/lib/intelligent-ui/schema";
import EvidenceButtons from "./EvidenceButtons";

const statuses = {
  ready: { label: "Ready", icon: Check },
  "needs-review": { label: "Needs review", icon: ScanEye },
  missing: { label: "Missing", icon: CircleDashed },
};

interface SurfaceChecklistProps {
  component: ChecklistComponent;
  onInspectEvidence: (id: string) => void;
}

const SurfaceChecklist = ({
  component,
  onInspectEvidence,
}: SurfaceChecklistProps) => {
  const headingId = useId();
  return (
    <section
      aria-labelledby={headingId}
      className="rounded-2xl bg-card p-5 shadow-[0_0_0_1px_var(--border)] sm:p-6"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <h3 id={headingId} className="text-lg font-medium tracking-tight">
          {component.title}
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {component.items.filter((item) => item.status === "ready").length} of{" "}
          {component.items.length} ready
        </span>
      </div>
      {component.items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No checklist items provided.
        </p>
      ) : (
        <ul className="space-y-4">
          {component.items.map((item) => {
            const { label, icon: Icon } = statuses[item.status];
            return (
              <li key={item.id} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <Icon
                    aria-hidden="true"
                    className="size-4"
                    strokeWidth={1.5}
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <p className="break-words text-sm font-medium">
                      {item.label}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {label}
                    </span>
                  </div>
                  {item.detail && (
                    <p className="mt-1 break-words text-sm leading-6 text-muted-foreground">
                      {item.detail}
                    </p>
                  )}
                  <EvidenceButtons
                    evidenceIds={item.evidenceIds}
                    label={item.label}
                    onInspectEvidence={onInspectEvidence}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default SurfaceChecklist;
