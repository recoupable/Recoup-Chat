"use client";

import { useState } from "react";
import {
  ArrowRight,
  Check,
  FileText,
  Layers2,
  Pause,
  Play,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExampleReplay } from "@/lib/intelligent-ui/playground/useExampleReplay";
import { usePlaygroundView } from "@/lib/intelligent-ui/playground/usePlaygroundView";
import type { PlaygroundScenario } from "@/lib/intelligent-ui/playground/scenarios";
import SurfaceRenderer from "./SurfaceRenderer";
import EvidencePanel from "./EvidencePanel";

const statusLabels = {
  ready: "Ready to explore",
  streaming: "Receiving example updates",
  complete: "Example complete",
  stopped: "Replay stopped",
  error: "Update interrupted",
};

export default function PlaygroundWorkspace({
  scenario,
}: {
  scenario: PlaygroundScenario;
}) {
  const { surface, status, error, replay, stop } = useExampleReplay(scenario);
  const { view, setView, saved, restored } = usePlaygroundView(scenario);
  const [textView, setTextView] = useState(false);
  const [focusRequest, setFocusRequest] = useState(0);
  const evidence =
    surface.evidence.find((item) => item.id === view.evidenceId) ?? null;
  const visibleIds = new Set(
    surface.components.flatMap((component) =>
      component.type === "collection"
        ? component.rows.map((row) => row.id)
        : [],
    ),
  );
  const selectedCount = view.selectedRowIds.filter((id) =>
    visibleIds.has(id),
  ).length;

  return (
    <section aria-label={`${scenario.label} example`} className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-5 rounded-2xl bg-secondary px-5 py-5 sm:px-7">
        <div className="max-w-2xl">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            The request
          </p>
          <p className="text-lg font-medium tracking-tight sm:text-xl">
            {scenario.prompt}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Select a row and write a note. Then replay the updates—your work
            stays in place.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {status === "streaming" ? (
            <Button
              onClick={stop}
              variant="secondary"
              className="h-11 bg-card px-5"
            >
              <Pause aria-hidden="true" /> Stop replay
            </Button>
          ) : (
            <Button
              onClick={() => void replay()}
              className="h-11 bg-brand-lime px-5 text-brand-on-lime shadow-none hover:bg-brand-lime-hover"
            >
              <Play aria-hidden="true" /> Replay updates
            </Button>
          )}
          <Button
            onClick={() => setTextView((value) => !value)}
            variant="ghost"
            aria-pressed={textView}
            className="h-11 px-4"
          >
            {textView ? (
              <Layers2 aria-hidden="true" />
            ) : (
              <FileText aria-hidden="true" />
            )}
            {textView ? "Visual view" : "Text view"}
          </Button>
        </div>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:gap-12">
        <div className="min-w-0 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                <span>{scenario.category}</span>
                <ArrowRight className="size-3" aria-hidden="true" />
                <span>Working surface</span>
              </div>
              <h2 className="text-3xl font-medium tracking-[-0.04em] sm:text-4xl">
                {surface.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {surface.description}
              </p>
            </div>
            <div className="text-right">
              <p
                role="status"
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <span
                  aria-hidden="true"
                  className={`size-1.5 rounded-full ${status === "complete" ? "bg-brand-link" : "bg-muted-foreground"}`}
                />
                {statusLabels[status]}
              </p>
              <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                Revision {surface.revision} · synthetic data
              </p>
            </div>
          </div>

          {error && (
            <div role="alert" className="rounded-xl bg-secondary p-4 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="relative min-w-0 flex-1 sm:max-w-xs">
              <span className="sr-only">Filter rows</span>
              <Search
                className="pointer-events-none absolute top-3.5 left-3.5 size-4 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                value={view.filter}
                maxLength={200}
                onChange={(event) =>
                  setView((current) => ({
                    ...current,
                    filter: event.target.value,
                  }))
                }
                placeholder="Find a row…"
                disabled={textView || !restored}
                className="h-11 w-full rounded-xl bg-card pr-3 pl-10 text-base shadow-[0_0_0_1px_var(--input)] outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 sm:text-sm"
              />
            </label>
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Check className="size-3.5" aria-hidden="true" />
              {selectedCount} selected
              {view.selectedRowIds.length > selectedCount
                ? ` · ${view.selectedRowIds.length - selectedCount} awaiting records`
                : ""}
            </p>
          </div>

          {textView ? (
            <article
              aria-label="Text version of the surface"
              className="space-y-5 rounded-2xl bg-card p-6 shadow-[0_0_0_1px_var(--border)]"
            >
              <h3 className="text-lg font-medium">
                The same evidence, in plain text
              </h3>
              <p className="whitespace-pre-wrap text-sm leading-7">
                {surface.fallbackText}
              </p>
              <div className="space-y-4">
                {surface.evidence.map((source) => (
                  <div key={source.id}>
                    <h4 className="text-sm font-medium">{source.label}</h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {source.kind} · {source.status} · {source.sourceLabel}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {source.text}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ) : (
            <SurfaceRenderer
              showHeading={false}
              surface={surface}
              selectedRowIds={view.selectedRowIds}
              filter={view.filter}
              onSelectRow={(id) =>
                setView((current) => ({
                  ...current,
                  selectedRowIds: current.selectedRowIds.includes(id)
                    ? current.selectedRowIds.filter(
                        (selected) => selected !== id,
                      )
                    : [...current.selectedRowIds, id],
                }))
              }
              onInspectEvidence={(id) => {
                setView((current) => ({ ...current, evidenceId: id }));
                setFocusRequest((value) => value + 1);
              }}
            />
          )}
        </div>

        <aside
          aria-label="Evidence and working notes"
          className="min-w-0 space-y-6 lg:sticky lg:top-6"
        >
          <EvidencePanel
            focusRequest={focusRequest}
            evidence={evidence}
            onClose={() =>
              setView((current) => ({ ...current, evidenceId: null }))
            }
          />
          <section className="rounded-2xl bg-secondary/60 p-5">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="working-notes" className="text-sm font-medium">
                Your working notes
              </label>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Local only
              </span>
            </div>
            <textarea
              id="working-notes"
              value={view.notes}
              maxLength={4000}
              disabled={!restored}
              onChange={(event) =>
                setView((current) => ({
                  ...current,
                  notes: event.target.value,
                }))
              }
              rows={5}
              placeholder="What would you follow up on?"
              className="mt-4 w-full resize-y rounded-xl bg-card p-3 text-base leading-6 shadow-[0_0_0_1px_var(--border)] outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-sm"
            />
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              {saved
                ? "Saved on this device."
                : "Changes kept in this tab until device storage is available."}{" "}
              Keep these practice notes fictional.
            </p>
          </section>
          <div className="px-1 text-xs leading-6 text-muted-foreground">
            <p>
              Nothing here approves a release or places an order. This
              playground replays bundled examples; it does not call an AI model
              or your connected tools.
            </p>
          </div>
        </aside>
      </div>
      <details className="rounded-xl bg-secondary/40 px-5 py-4 text-sm">
        <summary className="cursor-pointer rounded-md font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring">
          Explore the surface contract
        </summary>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          Both examples use the same four component types. Stable identifiers
          connect the source evidence, the streamed revisions, and your local
          view. This is a versioned prototype contract, not a published SDK.
        </p>
        <pre
          className="mt-4 max-h-96 overflow-auto rounded-xl bg-card p-4 font-mono text-xs leading-6"
          tabIndex={0}
          aria-label="Surface JSON"
        >
          {JSON.stringify(surface, null, 2)}
        </pre>
      </details>
    </section>
  );
}
