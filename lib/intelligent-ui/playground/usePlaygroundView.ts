"use client";

import { useEffect, useState } from "react";
import {
  emptyViewState,
  viewStateSchema,
  VIEW_STATE_MAX_SERIALIZED_LENGTH,
  type PlaygroundViewState,
} from "./viewState";
import type { PlaygroundScenario } from "./scenarios";

/** Keep user work outside the streamed document; only synthetic view data is stored. */
export function usePlaygroundView(scenario: PlaygroundScenario) {
  const key = `recoup:iui:fixture-v1:${scenario.initial.context.workspaceId}:${scenario.initial.context.subject.kind}:${scenario.initial.context.subject.id}`;
  const [view, setView] = useState<PlaygroundViewState>(emptyViewState);
  const [restored, setRestored] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw && raw.length <= VIEW_STATE_MAX_SERIALIZED_LENGTH) {
        const result = viewStateSchema.safeParse(JSON.parse(raw));
        if (result.success) {
          const rowIds = new Set(
            scenario.events.flatMap((event) => {
              const components =
                event.type === "surface.snapshot"
                  ? event.surface.components
                  : event.type === "surface.patch"
                    ? event.upsert
                    : [];
              return components.flatMap((component) =>
                component.type === "collection"
                  ? component.rows.map((row) => row.id)
                  : [],
              );
            }),
          );
          const evidenceIds = new Set(
            scenario.initial.evidence.map((evidence) => evidence.id),
          );
          // Browser storage is unavailable during SSR; hydrate once before saving.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setView({
            ...result.data,
            selectedRowIds: [...new Set(result.data.selectedRowIds)].filter(
              (id) => rowIds.has(id),
            ),
            evidenceId:
              result.data.evidenceId && evidenceIds.has(result.data.evidenceId)
                ? result.data.evidenceId
                : null,
          });
        }
      }
    } catch {
      /* Storage may be disabled; the working view still works in memory. */
    }
    setRestored(true);
  }, [key, scenario]);

  useEffect(() => {
    if (!restored) return;
    // Bounded practice notes are saved immediately so switching examples cannot
    // discard an edit still waiting on a debounce timer.
    try {
      const serialized = JSON.stringify(viewStateSchema.parse(view));
      if (serialized.length > VIEW_STATE_MAX_SERIALIZED_LENGTH)
        throw new Error("Saved view exceeds the storage limit");
      localStorage.setItem(key, serialized);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Report the outcome of the external storage write.
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }, [key, restored, view]);

  return { view, setView, saved, restored };
}
