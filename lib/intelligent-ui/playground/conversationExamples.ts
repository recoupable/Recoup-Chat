import type { PresentationIntent } from "../presentation/types";
import type { ScenarioId } from "./scenarios";

export type ConversationExample = {
  id: string;
  label: string;
  scenarioId: ScenarioId;
  prompt: string;
  answer: string;
  intent: PresentationIntent;
  sourceIds: string[];
  inlineTitle?: string;
  recordLabel?: string;
  columnKeys?: string[];
  allRecordsLabel?: string;
  followUp?: { label: string; draft: string };
};

// Domain-authored examples, not generated recommendations or renderer logic.
export const conversationExamples: ConversationExample[] = [
  {
    id: "release-review",
    label: "Release readiness",
    scenarioId: "release",
    prompt: "What needs attention before Night Swimming is ready?",
    answer:
      "Artwork and contributor documentation still need attention. Jules owns both affected tracks; the other two are ready for review.",
    intent: {
      kind: "review",
      componentId: "release-tracks",
      rowIds: ["after-hours", "daybreak"],
    },
    sourceIds: ["delivery-sheet", "contributor-note"],
    inlineTitle: "Night Swimming · follow-ups",
    recordLabel: "Track",
    columnKeys: ["review", "owner"],
    allRecordsLabel: "View all 4 tracks",
    followUp: {
      label: "Draft follow-up",
      draft:
        "Hi Jules — could you add the artwork for After Hours and confirm the contributor documentation for Daybreak? The delivery sheet lists a Daybreak master but does not confirm its artwork, so please check that too. Let me know when these are ready for review. Thanks!",
    },
  },
  {
    id: "supplier-comparison",
    label: "Supplier comparison",
    scenarioId: "sourcing",
    prompt: "Which supplier makes sense for 500 studio bags?",
    answer:
      "Common Ground has the shortest quoted lead time. Fieldwork costs least, but its sample review is missing. I’d check that gap before choosing; none of the supplied records includes material certification.",
    intent: { kind: "compare", componentId: "supplier-quotes" },
    sourceIds: ["quote-sheet", "sample-log"],
    inlineTitle: "Studio bags · 500 units",
    recordLabel: "Supplier",
    followUp: {
      label: "Draft sample request",
      draft:
        "Hi Fieldwork — before we review your quote for 500 studio bags, could you share a sample for review and the material certification? Please also confirm the quoted $2,250 total and 28-day lead time. This is an information request, not an order. Thanks!",
    },
  },
  {
    id: "simple-answer",
    label: "Simple answer",
    scenarioId: "release",
    prompt: "How many tracks are on Night Swimming?",
    answer: "Night Swimming has four tracks, according to the delivery sheet.",
    intent: { kind: "text" },
    sourceIds: ["delivery-sheet"],
  },
];
