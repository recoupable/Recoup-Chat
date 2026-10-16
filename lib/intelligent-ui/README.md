# Intelligent UI playground

An executable design slice of [epic #2197](https://github.com/recoupable/app/issues/2197),
guided by [RFC #2240](https://github.com/recoupable/app/issues/2240).
See [RESEARCH.md](./RESEARCH.md) for the 2026 studies, design decisions, limits,
and proposed evaluation. This redesign has not undergone a comparative user study.

Run `pnpm install --frozen-lockfile`, then `pnpm dev`, and open
`/labs/intelligent-ui`. No AI, authentication, or database credentials are needed.
A Vercel preview must set `RECOUP_INTELLIGENT_UI_PLAYGROUND=true`. Production
always returns 404 for both the page and stream endpoint.

## Conversation first

The host shows a question and a concise answer in Recoup's normal reading column.
A pure presentation policy may add **one** useful collection. It never adds UI
just because the document contains components.

- Release review shows two affected tracks, with all four available on request.
- Supplier comparison aligns three quotes, lead times, and sample-review status.
- A simple track-count question returns text with an optional source link.
- Sources open on request. A desktop table becomes labelled records on narrow
  containers, retaining decision-relevant fields without horizontal scrolling.
- One follow-up action opens an editable local draft. Copying has an accessible
  manual fallback. No message is sent, model called, or business action executed.

The hero, repeated summaries/metrics/checklists, search, ineffective row selection,
and permanent evidence/notes rail have been removed. Their unused React renderers
were deleted. The four versioned **contract** types remain in protocol fixtures
so selection can be tested against a richer document without rendering it all.
This is not a complete component catalog or a published SDK.

## Boundaries

| Layer             | Files                                                              | Responsibility                                                       |
| ----------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Portable contract | `schema.ts`, `validateUniqueIds.ts`                                | Strict v1 validation; no React, Next, DOM, or service imports        |
| Protocol          | `applySurfaceEvent.ts`, `parseSurfaceStream.ts`, `streamLimits.ts` | Atomic revisions and bounded decoding                                |
| Presentation      | `presentation/`                                                    | Host-authored task intent; text or one useful collection             |
| React adapter     | `components/IntelligentUI/InlineCollection.tsx`, `Evidence*`       | Inert text, responsive patterns, source disclosure                   |
| Example host      | `playground/`, `Playground*`, `FollowUpDraft.tsx`                  | Fixture data, paired authored answers, local drafts, replay controls |
| Transport         | `app/api/intelligent-ui/playground/route.ts`                       | Environment gate, fixture enum, cancellable NDJSON                   |

The policy is a conservative prototype, not a learned ranking system. Comparison
requires at least two distinct records with a meaningful difference in a displayed
schema column. Review requires an explicit, valid subset. Missing candidates fall
back to text. It contains no confidence scores, domain lookups, or action authority.
The host narrows release columns only for review; comparisons retain all columns
used by the policy. Source coverage remains distinct from subset completeness.

## Replay and response coherence

The lab opens with the completed, validated fixture, not a loading dashboard.
Protocol diagnostics and replay are behind **About this example**.

1. `surface.snapshot` initializes an empty stream with a validated document.
   The host checks surface, workspace, subject kind, and subject ID.
2. `surface.patch` requires the exact current base revision and advances by one.
   Upserts/removals and optional evidence replacement are validated atomically.
3. `surface.complete` must match the document revision. Events after completion
   and EOF before completion are errors.

`useExampleReplay` exposes the latest valid streamed document separately from
`completedSurface`, which commits only after a valid completion **and EOF**.
The visible answer stays intact during replay, interruption, or cancellation.
An old request cannot replace a newer request's result.

Authored prose and drafts describe one exact fixture. The conversation adopts a
completed replay only if its content matches that fixture; a changed document is
reported in diagnostics and cannot silently contradict the authored answer.
A future live producer needs a versioned answer/UI bundle; this fixture guard is
not a substitute for that contract. The lab makes no model-generation claim.

Stable IDs preserve component identity. Drafts and disclosure state live outside
the streamed document. No update steals focus, overwrites an edit, or opens a source.
Stream completion does not establish source completeness or business approval.

Unknown versions/types, invalid references, blank labels, invalid dates, and
unsafe source links are rejected. Text stays inert. Links permit credential-free
HTTPS only. Bounds: 256 KiB per line, 2 MiB per stream, 256 events, plus schema
limits on fields and records. These are prototype limits, not tenant authorization.

## Persistence and availability

`PlaygroundWorkspace` is keyed by conversation example. Switching examples
unmounts and aborts the old controller. Existing fixture-version/workspace/subject
storage validates state before restoration, discards unknown IDs, and uses the
same serialized-size bound for reads and writes. Drafts are saved immediately;
storage failure leaves them usable in the tab. Restoring never opens an inspector.
Only local view state is stored, not accepted business records. Fixture version 1
must change if IDs acquire different meanings.

The exact lab path is gated in `proxy.ts` before root Suspense can commit HTTP 200.
The page and stream also gate independently. Production stays inaccessible even
if the preview flag is set. The exact lab mounts only the theme provider, avoiding
account, wallet, checkout, and impersonation effects. Other routes retain their
normal providers. PWA NetworkOnly rules exclude the page/stream from response
caches. The dynamic page is noindex.

## Stories and remaining work

A coordinator can identify affected tracks, inspect evidence, and prepare a local
follow-up. An operator can compare suppliers with the same renderer. A simple
question needs no widget. Drafts survive replay/reload; source dialogs return focus
to their initiating controls. Integrators can inspect malformed or partial streams
without displacing the coherent answer.

This advances #2202–#2207, including selectivity (#2204), but does not close their
platform-wide acceptance criteria. Live chat (#2209), model-produced response
bundles, authorized adapters/actions, receipts, cross-device state, distributed
packages/second hosts, and usability evaluation remain separate work.

## Verification

Run, as one line:

```sh
pnpm exec vitest run lib/intelligent-ui components/IntelligentUI app/labs/intelligent-ui providers/__tests__/PlaygroundProviders.test.tsx components/Context/__tests__/ContextPageLayout.test.tsx
```

Also run `pnpm exec next typegen`, `pnpm exec tsc --noEmit`, and scoped ESLint.
The feature CI runs these checks. Tests cover selectivity, protocol limits and
ordering, coherent replay commits, source safety, dialogs, draft persistence,
clipboard recovery, environment gates, and provider/cache isolation.

Manual visual checks remain necessary: desktop/mobile, text resizing, dark mode,
keyboard order, source popover-to-dialog handoff, draft close/restore, and replay
while editing. Automated DOM checks do not establish visual quality or prove
that the interface improves real user outcomes.
