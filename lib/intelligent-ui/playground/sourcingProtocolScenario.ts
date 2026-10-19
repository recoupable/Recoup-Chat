import type { Component, Evidence, Surface } from "../schema";
import type { PlaygroundScenario } from "./scenarioTypes";

const sourcingEvidence: Evidence[] = [
  {
    id: "quote-sheet",
    label: "Supplier quotes · October",
    sourceLabel: "Fictional operations / quote comparison",
    observedAt: "2026-10-16T10:00:00Z",
    kind: "submitted",
    status: "current",
    text: "SYNTHETIC EXAMPLE. For 500 reusable studio bags, Northline quoted $2,400 with a 21-day lead time; Common Ground quoted $2,650 with a 14-day lead time; Fieldwork quoted $2,250 with a 28-day lead time. These are invented quotes, not offers from real suppliers.",
  },
  {
    id: "sample-log",
    label: "Sample review log",
    sourceLabel: "Fictional operations / sample notes",
    observedAt: "2026-10-16T10:05:00Z",
    kind: "observed",
    status: "partial",
    text: "SYNTHETIC EXAMPLE. Northline and Common Ground have sample reviews in the fixture. Fieldwork has no sample review. Material certification is not included for any supplier; no purchasing approval is recorded.",
  },
];

const sourcingRows = [
  {
    id: "northline",
    label: "Northline",
    values: { quote: "$2,400", lead: "21 days", review: "Sample reviewed" },
    evidenceIds: ["quote-sheet", "sample-log"],
  },
  {
    id: "common-ground",
    label: "Common Ground",
    values: { quote: "$2,650", lead: "14 days", review: "Sample reviewed" },
    evidenceIds: ["quote-sheet", "sample-log"],
  },
  {
    id: "fieldwork",
    label: "Fieldwork",
    values: { quote: "$2,250", lead: "28 days", review: "Sample pending" },
    evidenceIds: ["quote-sheet", "sample-log"],
  },
];

const sourcingCollection: Component = {
  type: "collection",
  id: "supplier-quotes",
  title: "Supplier comparison",
  columns: [
    { key: "quote", label: "Quote / 500 units" },
    { key: "lead", label: "Lead time" },
    { key: "review", label: "Review" },
  ],
  rows: sourcingRows,
  complete: true,
  totalCount: 3,
};

const sourcingInitial: Surface = {
  schemaVersion: 1,
  id: "example-sourcing",
  revision: 0,
  title: "Studio essentials",
  description: "Supplier review · reusable studio bags",
  context: {
    workspaceId: "example-studio",
    subject: {
      kind: "sourcing-review",
      id: "studio-bags",
      label: "Studio bags / 500 units",
    },
  },
  components: [
    {
      type: "summary",
      id: "sourcing-summary",
      title: "Compare with confidence",
      text: "Compare the quotes, check what the sample notes actually support, and save a shortlist. The same working surface adapts to an operations decision.",
      evidenceIds: ["quote-sheet"],
    },
    {
      type: "metrics",
      id: "sourcing-metrics",
      title: "At a glance",
      items: [
        {
          id: "quotes",
          label: "Quote rows loaded",
          value: "1 / 3",
          detail: "Example stream has more records",
          evidenceIds: ["quote-sheet"],
        },
        {
          id: "volume",
          label: "Order quantity",
          value: "500",
          detail: "Units in the example request",
          evidenceIds: ["quote-sheet"],
        },
      ],
    },
    { ...sourcingCollection, rows: sourcingRows.slice(0, 1), complete: false },
  ],
  evidence: sourcingEvidence,
  fallbackText:
    "Synthetic supplier example for 500 studio bags. One of three quote rows loaded: Northline, $2,400, 21 days, sample reviewed. Source: fictional October quote comparison and sample log. No purchase has been approved or placed.",
};

export const sourcingProtocolScenario: PlaygroundScenario = {
  id: "sourcing",
  label: "Supplier review",
  category: "Operations",
  prompt: "Help me compare these suppliers and find the gaps.",
  initial: sourcingInitial,
  events: [
    { type: "surface.snapshot", surface: sourcingInitial },
    {
      type: "surface.patch",
      surfaceId: sourcingInitial.id,
      baseRevision: 0,
      revision: 1,
      upsert: [
        sourcingCollection,
        {
          type: "metrics",
          id: "sourcing-metrics",
          title: "At a glance",
          items: [
            {
              id: "quotes",
              label: "Quotes compared",
              value: "3",
              detail: "All example quotes received",
              evidenceIds: ["quote-sheet"],
            },
            {
              id: "fastest",
              label: "Shortest lead time",
              value: "14 days",
              detail: "Common Ground · submitted quote",
              evidenceIds: ["quote-sheet"],
            },
            {
              id: "samples",
              label: "Samples reviewed",
              value: "2 / 3",
              detail: "Fieldwork review is missing",
              evidenceIds: ["sample-log"],
            },
          ],
        },
      ],
      remove: [],
      fallbackText:
        "Synthetic supplier comparison for 500 studio bags. Northline: $2,400, 21 days, sample reviewed. Common Ground: $2,650, 14 days, sample reviewed. Fieldwork: $2,250, 28 days, sample pending. No supplier has a material certification in this fixture. Sources: fictional October quotes and sample log. No purchase has been approved or placed.",
    },
    {
      type: "surface.patch",
      surfaceId: sourcingInitial.id,
      baseRevision: 1,
      revision: 2,
      upsert: [
        {
          type: "checklist",
          id: "sourcing-followups",
          title: "Before the next decision",
          items: [
            {
              id: "compare",
              label: "Compare all three quotes",
              detail: "All suppliers quote the same example quantity.",
              status: "ready",
              evidenceIds: ["quote-sheet"],
            },
            {
              id: "sample",
              label: "Request the Fieldwork sample review",
              detail: "A missing review is still an open question.",
              status: "missing",
              evidenceIds: ["sample-log"],
            },
            {
              id: "certificate",
              label: "Review material certification",
              detail: "No certification is included for any supplier.",
              status: "needs-review",
              evidenceIds: ["sample-log"],
            },
          ],
        },
      ],
      remove: [],
    },
    { type: "surface.complete", surfaceId: sourcingInitial.id, revision: 2 },
  ],
};
