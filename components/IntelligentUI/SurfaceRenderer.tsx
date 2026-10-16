"use client";

import { useId } from "react";
import { Sparkles } from "lucide-react";
import type { Surface } from "@/lib/intelligent-ui/schema";
import EvidenceButtons from "./EvidenceButtons";
import SurfaceChecklist from "./SurfaceChecklist";
import SurfaceCollection from "./SurfaceCollection";
import SurfaceMetrics from "./SurfaceMetrics";

interface SurfaceRendererProps {
  surface: Surface;
  selectedRowIds: string[];
  onSelectRow: (id: string) => void;
  onInspectEvidence: (id: string) => void;
  filter: string;
  showHeading?: boolean;
}

const SurfaceRenderer = ({
  surface,
  selectedRowIds,
  onSelectRow,
  onInspectEvidence,
  filter,
  showHeading = true,
}: SurfaceRendererProps) => {
  const headingId = useId();
  return (
    <section
      aria-labelledby={showHeading ? headingId : undefined}
      aria-label={showHeading ? undefined : surface.title}
      className="min-w-0 space-y-6 text-foreground"
    >
      {showHeading && (
        <header>
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <span className="break-words">{surface.context.subject.label}</span>
            <span aria-hidden="true">/</span>
            <span>Revision {surface.revision}</span>
          </div>
          <h2
            id={headingId}
            className="break-words text-2xl font-medium leading-tight tracking-tight sm:text-3xl"
          >
            {surface.title}
          </h2>
          <p className="mt-2 max-w-2xl break-words text-sm leading-6 text-muted-foreground">
            {surface.description}
          </p>
        </header>
      )}

      {surface.components.length === 0 && (
        <p className="whitespace-pre-wrap rounded-2xl bg-card p-6 text-sm leading-7 shadow-[0_0_0_1px_var(--border)]">
          {surface.fallbackText}
        </p>
      )}

      {surface.components.map((component) => {
        switch (component.type) {
          case "summary":
            return (
              <section
                key={component.id}
                aria-label={component.title}
                className="rounded-2xl bg-secondary p-5 text-secondary-foreground sm:p-6"
              >
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles
                    aria-hidden="true"
                    className="size-4 shrink-0"
                    strokeWidth={1.5}
                  />
                  <h3 className="break-words text-sm font-medium">
                    {component.title}
                  </h3>
                </div>
                <p className="whitespace-pre-wrap break-words text-sm leading-7 [overflow-wrap:anywhere]">
                  {component.text}
                </p>
                <div className="mt-3">
                  <EvidenceButtons
                    evidenceIds={component.evidenceIds}
                    label={component.title}
                    onInspectEvidence={onInspectEvidence}
                  />
                </div>
              </section>
            );
          case "metrics":
            return (
              <SurfaceMetrics
                key={component.id}
                component={component}
                onInspectEvidence={onInspectEvidence}
              />
            );
          case "collection":
            return (
              <SurfaceCollection
                key={component.id}
                component={component}
                selectedRowIds={selectedRowIds}
                onSelectRow={onSelectRow}
                onInspectEvidence={onInspectEvidence}
                filter={filter}
              />
            );
          case "checklist":
            return (
              <SurfaceChecklist
                key={component.id}
                component={component}
                onInspectEvidence={onInspectEvidence}
              />
            );
        }
      })}
    </section>
  );
};

export default SurfaceRenderer;
