import type { Representation } from "../representations/schemas";

export type PresentationIntent =
  | { kind: "text" }
  | {
      kind: "representation";
      componentId: string;
      benefit: "show-distribution" | "navigate-time";
    };

export type PresentationDecision =
  | {
      mode: "text";
      reason:
        | "text-sufficient"
        | "unsupported-intent"
        | "representation-unavailable"
        | "benefit-mismatch"
        | "unsupported-host";
    }
  | {
      mode: "visual";
      component: Representation;
      reason: "show-distribution" | "navigate-time";
    };

export type RepresentationCapabilities = {
  distribution: boolean;
  timeline: boolean;
};
