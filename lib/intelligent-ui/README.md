# Intelligent UI playground

First executable slice of [epic #2197](https://github.com/recoupable/app/issues/2197),
guided by [RFC #2240](https://github.com/recoupable/app/issues/2240).

Run `pnpm install --frozen-lockfile`, then `pnpm dev`, and open
`/labs/intelligent-ui`. No AI, authentication, or database credentials are needed
for these synthetic examples. A Vercel preview must explicitly set
`RECOUP_INTELLIGENT_UI_PLAYGROUND=true`. Production deployments always return 404
for both the page and its stream endpoint. The examples cannot execute tools,
approve a release, or place an order.

## What is implemented

- One validated surface contract and a fixed catalog of four components:
  summary, metrics, collection, and checklist.
- A React renderer shared by release-readiness and supplier-review scenarios.
  Domain labels and evidence are fixture data; the renderer contains no artist,
  supplier, tool, or account lookup logic.
- Actual paced NDJSON transport over a Next route: snapshot, two atomic patches,
  completion. The producer replays bundled examples; it does not generate content.
- Evidence inspection with source, time, submitted/observed/derived/proposed kind,
  and current/partial/withdrawn status. Stream completion never implies evidence
  completeness or business approval.
- Local filtering, row selection, evidence inspection, notes, and a plain-text
  representation. User state survives streamed revisions and reloads. Only view
  state is stored on the device; streamed documents are not accepted records.
- Cancellation, late-request rejection, invalid-update recovery, accessible
  controls, mobile horizontal table scrolling, and light/dark tokens.

## Boundaries

| Layer             | Files                                                              | Responsibility                                                            |
| ----------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| Portable contract | `schema.ts`, `validateUniqueIds.ts`                                | Strict v1 data validation; no React, Next, DOM, or Recoup service imports |
| Protocol          | `applySurfaceEvent.ts`, `parseSurfaceStream.ts`, `streamLimits.ts` | Atomic revisions and bounded stream decoding                              |
| React adapter     | `components/IntelligentUI/Surface*`, `Evidence*`                   | Inert text, accessible visual patterns, interaction callbacks             |
| Example host      | `playground/`, `components/IntelligentUI/Playground*`              | Synthetic domain data, fetch lifecycle, local persistence, controls       |
| Transport entry   | `app/api/intelligent-ui/playground/route.ts`                       | Environment gate, fixture enum, cancellable stream                        |

This is an internal prototype, not a published SDK. The fixed catalog is the
minimal baseline for the runtime comparison in #2200; it does not claim OpenUI,
json-render, A2UI, or ChatGPT's private implementation has won that comparison.
Nothing interprets model-produced JavaScript, HTML, arbitrary URLs, or tool names.

## Protocol v1

1. `surface.snapshot` initializes an empty stream session with a complete validated
   document. The host verifies its surface, workspace, and subject identities
   against the selected scenario.
2. `surface.patch` targets that surface, requires the exact current `baseRevision`,
   and advances `revision` by one. Components are upserted/removed atomically.
   An optional evidence list replaces the whole evidence set in the same transaction.
   The final document must still have valid references. The context is immutable.
3. `surface.complete` must match the current surface/revision. The host rejects
   any later event and treats an EOF before completion as interruption.

Stable component IDs keep React trees mounted. Collection row IDs are unique
across a surface so controlled selection is unambiguous. Other item IDs are unique
within their component. Replay creates a new stream session; it preserves local
selection even while previously seen rows await their replayed records.

Unknown versions and component types are rejected. Invalid patches leave the last
valid view intact. Source links permit only credential-free HTTPS; text stays
inert. Parser limits are 256 KiB per line, 2 MiB per stream, and 256 events. Zod
also bounds text, components, rows, columns, and evidence references. These limits
are prototype defaults, not an authorization or tenancy boundary.

## Persistence and isolation

`PlaygroundWorkspace` is keyed by scenario, so switching examples unmounts the old
controller and aborts its request. A request identity check also rejects callbacks
from superseded fetches. Device state uses a fixture-version/workspace/subject
namespace and is validated before restoration. Unknown row/evidence IDs are
discarded. Storage failures leave the working view usable and report that it has
not been saved. Fixture version 1 must change if fixture IDs acquire new meanings.

The exact lab path is also gated in `proxy.ts`, before the root Suspense boundary
can commit a streaming HTTP 200 response. The page retains its independent gate;
the stream endpoint does not depend on the proxy. Other routes pass through.

The exact lab path mounts only the theme provider, avoiding account provisioning,
wallet, checkout, and impersonation effects. Nearby paths retain their existing
providers and chrome. Exact PWA NetworkOnly rules keep the page and its GET stream
out of offline response caches. The page is dynamic and noindex.

## Stories exercised

- As a release coordinator, I can see which example tracks need follow-up and
  inspect what supports each claim.
- As an operator, I can compare supplier quotes using the same components without
  music-specific code in the renderer.
- As a reviewer, I can select records and take notes while further records arrive.
- As a returning user, I can recover my practice notes and selection on this device.
- As a keyboard or mobile user, I can inspect evidence and use the text view.
- As an integrator, I can inspect the document and reject stale or malformed updates
  before they reach the renderer.

These advance #2202, #2203, #2205, #2206, and #2207; they do not satisfy those
tickets' entire platform acceptance criteria. Live chat integration (#2209),
authorized data adapters, action receipts/approval, cross-device persistence,
package distribution/second host, and a model-driven producer remain subsequent
work. Existing backend authority and company/subject identities remain owned by
their existing services.

## Verification

Run `pnpm exec vitest run lib/intelligent-ui components/IntelligentUI
app/labs/intelligent-ui providers/__tests__/PlaygroundProviders.test.tsx
components/Context/__tests__/ContextPageLayout.test.tsx` (as one line).
Tests cover protocol limits, references, source safety, revision ordering,
cancellation, restored state, renderer interaction, environment gates, and
provider/cache boundaries. Also run `pnpm exec next typegen`,
`pnpm exec tsc --noEmit`, and scoped ESLint. The Intelligent UI GitHub workflow
runs these checks for changes to this feature and its integration boundaries.

Browser checks: select a row and enter a fictional note, replay updates, inspect
both sources on a row, switch examples during replay, return/reload, filter to
zero matches, toggle text view, and check mobile/dark/keyboard behavior.
