# Snapshot transport contracts

This is a synthetic contract slice of [#2205](https://github.com/recoupable/app/issues/2205).
It depends on the Surface schema from unmerged [#2243](https://github.com/recoupable/app/pull/2243),
starting at `38fed8661af1f8cc03e3716863ee64afc4a323ad`. It is not imported by
production chat. The `data-intelligent-ui-snapshot` name is an experimental
candidate, not an enabled API contract.

## Acceptance and persistence

`acceptSurfaceSnapshotPart(message, input, scope)` folds a complete candidate
snapshot into one cumulative accepted assistant message:

- Stable identity is the message ID plus the data-part type and surface ID.
  The part ID must match the Surface ID. Workspace and subject must match scope.
- The existing strict Surface schema validates content and any written answer's
  revision. Unsupported, malformed, transient, foreign, or oversized parts are
  rejected without changing accepted state.
- A newer full snapshot replaces the previous one, including across revision
  gaps. This supports resynchronization because the snapshot is self-contained;
  it does not make missing patches safe to apply.
- Older revisions are stale. Identical revisions are replayed; changed content
  at the same revision is a conflict. Both keep the previous message. Equality
  ignores JSON object-key order while preserving array order.
- If restored copies coexist, the highest valid in-scope revision establishes
  the accepted floor, regardless of copy order. At that highest revision, the
  first stored copy wins ties; a conflicting replay cannot replace it. Stale,
  replayed, and conflicting inputs leave the stored message unchanged.
- Accepted input is parsed into detached data. Ordinary message parts retain
  their position, and replacement collapses duplicate parts for this surface.

`scope` must come from an already authenticated, authorized message context.
It is a consistency check, not authentication or an access-control decision.
The caller owns a sequential accepted-state fold; the returned message becomes
the input to the next candidate. Inputs are parsed JSON data, not executable
objects. “Accepted” here concerns snapshot validity, not approval of an action.

The SDK's raw `chat.messages` stores data parts in arrival order. It is not a
revision-aware accepted-state store. Feed data callbacks through acceptance
before treating a snapshot as current. The tests deliberately demonstrate that
a malformed UI candidate can remain in raw SDK state while accepted state and
the ordinary chat stream remain healthy.

`retainAcceptedSurfaceSnapshot(message, accepted, scope)` copies the canonical
accepted snapshot into a later cumulative message write, preserving other parts
and metadata. It never promotes an unaccepted raw SDK snapshot, even one with a
higher revision. It can restore a part omitted by a later model step and remove
duplicate target parts, retaining the highest valid saved revision with the same
tie rule. Reload must use that retained record as accepted state.
This pure fold provides no database locking, compare-and-swap, or protection
against concurrent writers; it is not wired into Supabase or an API writer.

## Bounds and transport ownership

Each candidate has a 256 KiB UTF-8 serialized acceptance bound, reusing
`SURFACE_STREAM_LIMITS.lineBytes`. The check runs after SDK parsing. It is not
a network buffering limit, a global chat budget, or a bound on total replay
traffic. The NDJSON playground's event and total-byte limits do not apply here.

The tests use the real `Chat` and the existing `createWorkflowChatTransport`.
Only external `fetch` responses are synthetic. The SDK owns authenticated
POST-to-GET recovery and its `startIndex` cursor, which counts all stream chunks.
Surface revisions are independent of that cursor. No alternate transport or
reconnection algorithm is introduced.

## Evidence and remaining work

Run `pnpm exec vitest run lib/intelligent-ui/transport` for coverage of stable-ID
replacement, stale/conflicting replay, invalid input isolation, serialized
reload, retention across cumulative writes, three reconnect cuts, and
byte-at-a-time SSE with split UTF-8. The same stream retains ordinary text,
reasoning, files, and tool results. No model or external service is called.

These are Node SDK and serialized-message tests against the app's installed
`ai@6.0.241`, `@ai-sdk/react@3.0.243`, and `@workflow/ai@4.2.0`. They do not prove
API package-version compatibility, real persistence, concurrent recovery,
renderer behavior, browser/media behavior, or latency/resource targets.
Production publication, integration, and the remaining #2205 acceptance criteria
require separate work. #2209 rendering is outside this slice; #2243's merge hold
is unchanged.
