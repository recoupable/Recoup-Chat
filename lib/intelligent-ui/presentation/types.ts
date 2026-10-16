import type { CollectionComponent } from "../schema";

/** The host names the task; available data alone does not request a UI. */
export type PresentationIntent =
  | { kind: "text" }
  | { kind: "compare"; componentId: string }
  | { kind: "review"; componentId: string; rowIds: string[] };

export type PresentationDecision =
  | {
      mode: "text";
      reason:
        | "text-requested"
        | "unsupported-intent"
        | "collection-unavailable"
        | "comparison-not-useful"
        | "review-rows-unavailable";
    }
  | {
      mode: "inline";
      component: CollectionComponent;
      /** Coverage of the original collection, independent of a review subset. */
      sourceComplete: boolean;
      reason: "comparison" | "review";
    };
