import type { Surface } from "../schema";
import { hasComparisonDifferences } from "./hasComparisonDifferences";
import type { PresentationDecision, PresentationIntent } from "./types";

/** Select one useful projection from a validated surface without changing it. */
export function selectPresentation(
  surface: Surface,
  intent: PresentationIntent,
): PresentationDecision {
  if (intent.kind === "text") return { mode: "text", reason: "text-requested" };
  if (intent.kind !== "compare" && intent.kind !== "review")
    return { mode: "text", reason: "unsupported-intent" };
  const component = surface.components.find(
    (item) => item.id === intent.componentId,
  );
  if (component?.type !== "collection")
    return { mode: "text", reason: "collection-unavailable" };
  if (intent.kind === "compare") {
    return hasComparisonDifferences(component)
      ? {
          mode: "inline",
          component,
          sourceComplete: component.complete,
          reason: "comparison",
        }
      : { mode: "text", reason: "comparison-not-useful" };
  }
  const requested = new Set(intent.rowIds);
  const rows = component.rows.filter((row) => requested.has(row.id));
  if (
    requested.size === 0 ||
    requested.size !== intent.rowIds.length ||
    rows.length !== requested.size
  ) {
    return { mode: "text", reason: "review-rows-unavailable" };
  }
  return {
    mode: "inline",
    component: { ...component, rows, complete: true, totalCount: rows.length },
    sourceComplete: component.complete,
    reason: "review",
  };
}
