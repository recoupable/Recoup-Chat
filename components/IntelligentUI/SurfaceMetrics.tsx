import { useId } from "react";
import type { MetricsComponent } from "@/lib/intelligent-ui/schema";
import EvidenceButtons from "./EvidenceButtons";

interface SurfaceMetricsProps {
  component: MetricsComponent;
  onInspectEvidence: (id: string) => void;
}

const SurfaceMetrics = ({
  component,
  onInspectEvidence,
}: SurfaceMetricsProps) => {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId}>
      <h3
        id={headingId}
        className="mb-3 text-sm font-medium text-muted-foreground"
      >
        {component.title}
      </h3>
      {component.items.length === 0 ? (
        <p className="rounded-2xl bg-card p-5 text-sm text-muted-foreground shadow-[0_0_0_1px_var(--border)]">
          No metrics provided.
        </p>
      ) : (
        <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {component.items.map((item) => (
            <div
              key={item.id}
              className="flex min-w-0 flex-col rounded-2xl bg-card p-5 shadow-[0_0_0_1px_var(--border)]"
            >
              <dt className="break-words text-xs text-muted-foreground">
                {item.label}
              </dt>
              <dd className="mt-3 break-words text-3xl font-medium leading-tight tracking-tight [overflow-wrap:anywhere]">
                {item.value}
              </dd>
              <dd className="mt-2 flex flex-1 flex-col">
                {item.detail && (
                  <p className="mb-2 break-words text-xs leading-5 text-muted-foreground">
                    {item.detail}
                  </p>
                )}
                <div className="mt-auto">
                  <EvidenceButtons
                    evidenceIds={item.evidenceIds}
                    label={item.label}
                    onInspectEvidence={onInspectEvidence}
                  />
                </div>
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
};

export default SurfaceMetrics;
