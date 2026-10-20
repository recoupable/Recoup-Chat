import type { Component, Evidence, Surface } from "../schema";
import type { PlaygroundScenario } from "./scenarioTypes";

const releaseEvidence: Evidence[] = [
  {
    id: "delivery-sheet",
    label: "Delivery sheet · revision 3",
    sourceLabel: "Fictional label / delivery worksheet",
    observedAt: "2026-10-16T09:00:00Z",
    kind: "submitted",
    status: "current",
    text: "SYNTHETIC EXAMPLE. Four tracks are planned for the Night Swimming EP. Glasshouse and Low Tide have masters and artwork. After Hours has a master but is missing artwork. Daybreak has a master, but its contributor confirmation is still pending. Maya coordinates Glasshouse and Low Tide; Jules coordinates After Hours and Daybreak. This worksheet is a submitted claim, not proof of ownership or delivery.",
  },
  {
    id: "contributor-note",
    label: "Contributor follow-up",
    sourceLabel: "Fictional project / review note",
    observedAt: "2026-10-16T09:05:00Z",
    kind: "observed",
    status: "partial",
    text: "SYNTHETIC EXAMPLE. The example project contains contributor confirmations for Glasshouse, Low Tide, and After Hours. No confirmation for Daybreak is included. A missing document is a review item; it does not establish whether a right exists.",
  },
  {
    id: "release-assessment",
    label: "Readiness calculation",
    sourceLabel: "Example rule / required materials",
    observedAt: "2026-10-16T09:06:00Z",
    kind: "derived",
    status: "partial",
    text: "SYNTHETIC EXAMPLE. A track is marked ready for review only when a master, artwork, and contributor confirmation appear in this fixture. Two of four tracks meet that condition. This is neither an approval nor a distribution action.",
  },
];

const releaseRows = [
  {
    id: "glasshouse",
    label: "Glasshouse",
    values: {
      material: "Master + artwork",
      review: "Ready for review",
      owner: "Maya",
    },
    evidenceIds: ["delivery-sheet", "contributor-note"],
  },
  {
    id: "low-tide",
    label: "Low Tide",
    values: {
      material: "Master + artwork",
      review: "Ready for review",
      owner: "Maya",
    },
    evidenceIds: ["delivery-sheet", "contributor-note"],
  },
  {
    id: "after-hours",
    label: "After Hours",
    values: {
      material: "Artwork missing",
      review: "Needs artwork",
      owner: "Jules",
    },
    evidenceIds: ["delivery-sheet"],
  },
  {
    id: "daybreak",
    label: "Daybreak",
    values: {
      material: "Master; artwork unconfirmed",
      review: "Confirm contributors; check artwork",
      owner: "Jules",
    },
    evidenceIds: ["delivery-sheet", "contributor-note"],
  },
];

const releaseCollection: Component = {
  type: "collection",
  id: "release-tracks",
  title: "Track readiness",
  columns: [
    { key: "material", label: "Materials" },
    { key: "review", label: "Next step" },
    { key: "owner", label: "Owner" },
  ],
  rows: releaseRows,
  complete: true,
  totalCount: 4,
};

const releaseMetrics: Component = {
  type: "metrics",
  id: "release-metrics",
  title: "At a glance",
  items: [
    {
      id: "tracks",
      label: "Tracks reviewed",
      value: "4 / 4",
      detail: "All example records received",
      evidenceIds: ["delivery-sheet"],
    },
    {
      id: "ready",
      label: "Ready for review",
      value: "2",
      detail: "Materials present; not approved",
      evidenceIds: ["release-assessment"],
    },
    {
      id: "followups",
      label: "Open follow-ups",
      value: "2",
      detail: "Artwork and contributor confirmation",
      evidenceIds: ["delivery-sheet", "contributor-note"],
    },
  ],
};

const releaseInitial: Surface = {
  schemaVersion: 1,
  id: "example-release",
  revision: 0,
  title: "Night Swimming",
  description: "Release readiness · four-track EP",
  context: {
    workspaceId: "example-label",
    subject: {
      kind: "release",
      id: "night-swimming",
      label: "Night Swimming EP",
    },
  },
  components: [
    {
      type: "summary",
      id: "release-summary",
      title: "A clear next step",
      text: "The release is taking shape. Review the materials, inspect the source behind each claim, and collect your follow-ups before making a decision.",
      evidenceIds: ["delivery-sheet"],
    },
    {
      type: "metrics",
      id: "release-metrics",
      title: "At a glance",
      items: [
        {
          id: "tracks",
          label: "Tracks received",
          value: "2 / 4",
          detail: "Example stream has more records",
          evidenceIds: ["delivery-sheet"],
        },
        {
          id: "ready",
          label: "Readiness",
          value: "In progress",
          detail: "Waiting for the complete example",
          evidenceIds: ["delivery-sheet"],
        },
      ],
    },
    { ...releaseCollection, rows: releaseRows.slice(0, 2), complete: false },
  ],
  evidence: releaseEvidence,
  fallbackText:
    "Synthetic Night Swimming example. Two of four tracks received: Glasshouse and Low Tide have masters and artwork. More example records are pending. Source: fictional delivery worksheet, revision 3. No release approval or delivery has occurred.",
};

export const releaseProtocolScenario: PlaygroundScenario = {
  id: "release",
  label: "Release readiness",
  category: "Music",
  prompt: "What needs attention before this EP is ready?",
  initial: releaseInitial,
  events: [
    { type: "surface.snapshot", surface: releaseInitial },
    {
      type: "surface.patch",
      surfaceId: releaseInitial.id,
      baseRevision: 0,
      revision: 1,
      upsert: [releaseCollection, releaseMetrics],
      remove: [],
      fallbackText:
        "Synthetic Night Swimming example. All four tracks received. Glasshouse and Low Tide are ready for review. After Hours needs artwork; Daybreak needs contributor confirmation and its artwork is unconfirmed. Sources: fictional delivery worksheet revision 3, contributor follow-up, and readiness calculation. No release approval or delivery has occurred.",
    },
    {
      type: "surface.patch",
      surfaceId: releaseInitial.id,
      baseRevision: 1,
      revision: 2,
      upsert: [
        {
          type: "checklist",
          id: "release-followups",
          title: "Before the next decision",
          items: [
            {
              id: "masters",
              label: "Masters are present",
              detail: "All four example tracks include a master.",
              status: "ready",
              evidenceIds: ["delivery-sheet"],
            },
            {
              id: "artwork",
              label: "Add the After Hours artwork",
              detail: "Jules · follow up with the creative team.",
              status: "missing",
              evidenceIds: ["delivery-sheet"],
            },
            {
              id: "confirmation",
              label: "Check Daybreak documentation",
              detail:
                "Jules · confirm contributors and check the unrecorded artwork before review.",
              status: "needs-review",
              evidenceIds: ["contributor-note"],
            },
          ],
        },
      ],
      remove: [],
    },
    { type: "surface.complete", surfaceId: releaseInitial.id, revision: 2 },
  ],
};
