"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronDown, PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExampleReplay } from "@/lib/intelligent-ui/playground/useExampleReplay";
import { usePlaygroundView } from "@/lib/intelligent-ui/playground/usePlaygroundView";
import { getCompletedExample } from "@/lib/intelligent-ui/playground/getCompletedExample";
import { selectPresentation } from "@/lib/intelligent-ui/presentation/selectPresentation";
import type { PlaygroundScenario } from "@/lib/intelligent-ui/playground/scenarios";
import type { ConversationExample } from "@/lib/intelligent-ui/playground/conversationExamples";
import InlineCollection from "./InlineCollection";
import EvidenceDialog from "./EvidenceDialog";
import FollowUpDraft from "./FollowUpDraft";
import PlaygroundDetails from "./PlaygroundDetails";

export default function PlaygroundWorkspace({
  scenario,
  example,
}: {
  scenario: PlaygroundScenario;
  example: ConversationExample;
}) {
  const replay = useExampleReplay(scenario);
  const baseline = useMemo(() => getCompletedExample(scenario), [scenario]);
  // Authored prose/drafts belong to this exact fixture, not merely its ID or
  // revision. A future producer must deliver text and UI as a coherent response.
  const matchesExample = useMemo(
    () =>
      !replay.completedSurface ||
      JSON.stringify(replay.completedSurface) === JSON.stringify(baseline),
    [replay.completedSurface, baseline],
  );
  const surface = matchesExample
    ? (replay.completedSurface ?? baseline)
    : baseline;
  const decision = selectPresentation(surface, example.intent);
  const { view, setView, saved, restored } = usePlaygroundView(scenario);
  const [showAll, setShowAll] = useState(false);
  const [showDraft, setShowDraft] = useState(false);
  const [evidenceId, setEvidenceId] = useState<string | null>(null);
  const [sourceTrigger, setSourceTrigger] = useState<HTMLElement | null>(null);
  const draftButton = useRef<HTMLButtonElement>(null);
  const draftRegion = useRef<HTMLDivElement>(null);
  const evidence =
    surface.evidence.find((item) => item.id === evidenceId) ?? null;
  const fullCollection =
    decision.mode === "inline"
      ? surface.components.find(
          (item) =>
            item.id === decision.component.id && item.type === "collection",
        )
      : undefined;
  const collection =
    decision.mode === "inline"
      ? showAll && fullCollection?.type === "collection"
        ? fullCollection
        : {
            ...decision.component,
            title: example.inlineTitle ?? decision.component.title,
            columns: example.columnKeys
              ? decision.component.columns.filter((column) =>
                  example.columnKeys!.includes(column.key),
                )
              : decision.component.columns,
          }
      : null;
  const inspectEvidence = (id: string, trigger?: HTMLElement) => {
    setSourceTrigger(
      trigger ??
        (document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null),
    );
    setEvidenceId(id);
  };
  return (
    <section
      id="conversation"
      tabIndex={-1}
      className="outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`${example.label} conversation`}
    >
      <div
        aria-label="Your question"
        className="mb-8 ml-auto w-fit max-w-[90%] rounded-[20px] rounded-br-md bg-muted px-4 py-3 text-base leading-7 sm:max-w-[85%] sm:px-5"
      >
        {example.prompt}
      </div>
      <article aria-label="Recoup response" className="space-y-5">
        <p className="whitespace-pre-wrap text-base leading-7 [text-wrap:pretty]">
          {decision.mode === "text" && example.intent.kind !== "text"
            ? surface.fallbackText
            : example.answer}
        </p>
        {collection && (
          <InlineCollection
            component={collection}
            recordLabel={example.recordLabel}
            evidence={surface.evidence}
            sourceComplete={
              decision.mode === "inline" ? decision.sourceComplete : undefined
            }
            onInspectEvidence={inspectEvidence}
          />
        )}
        {example.intent.kind === "text" && (
          <div className="flex flex-wrap gap-x-3">
            {example.sourceIds.map((id) => {
              const source = surface.evidence.find((item) => item.id === id);
              return source ? (
                <button
                  key={id}
                  type="button"
                  onClick={(event) => inspectEvidence(id, event.currentTarget)}
                  className="min-h-11 cursor-pointer rounded-lg text-xs text-muted-foreground underline decoration-border underline-offset-4 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {source.label}
                </button>
              ) : null;
            })}
          </div>
        )}
        {collection && (
          <div className="flex flex-wrap items-center justify-between gap-2">
            {example.followUp && (
              <Button
                ref={draftButton}
                variant="secondary"
                className="min-h-11 rounded-xl bg-primary px-4 text-primary-foreground hover:bg-primary/90"
                aria-expanded={showDraft}
                aria-controls="follow-up-region"
                disabled={!restored}
                onClick={() => {
                  if (!view.draftCreated && example.followUp)
                    setView((current) => ({
                      ...current,
                      notes: current.notes || example.followUp!.draft,
                      draftCreated: true,
                    }));
                  setShowDraft(true);
                  requestAnimationFrame(() =>
                    draftRegion.current
                      ?.querySelector("textarea")
                      ?.focus({ preventScroll: true }),
                  );
                }}
              >
                <PencilLine aria-hidden="true" className="size-4" />
                {example.followUp.label}
              </Button>
            )}
            {example.allRecordsLabel && (
              <button
                type="button"
                aria-expanded={showAll}
                onClick={() => setShowAll((value) => !value)}
                className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                {showAll ? "Show follow-ups only" : example.allRecordsLabel}
                <ChevronDown
                  className={`size-3.5 ${showAll ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
            )}
          </div>
        )}
      </article>
      <div ref={draftRegion} id="follow-up-region">
        {showDraft && (
          <FollowUpDraft
            value={view.notes}
            onChange={(notes) =>
              setView((current) => ({ ...current, notes, draftCreated: true }))
            }
            onClose={() => {
              setShowDraft(false);
              draftButton.current?.focus();
            }}
            saved={saved}
            restored={restored}
          />
        )}
      </div>
      <EvidenceDialog
        evidence={evidence}
        onClose={() => setEvidenceId(null)}
        returnFocus={sourceTrigger}
      />
      <PlaygroundDetails
        surface={surface}
        streamedSurface={replay.surface}
        decision={decision}
        status={matchesExample ? replay.status : "error"}
        error={
          matchesExample
            ? replay.error
            : "Replay data differs from the authored example. The original answer is still shown."
        }
        replay={() => void replay.replay()}
        stop={replay.stop}
      />
    </section>
  );
}
