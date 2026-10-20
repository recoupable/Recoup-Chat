# Workflow snapshot transport characterization

This is a test-only slice of [#2205](https://github.com/recoupable/app/issues/2205)
against the existing `createWorkflowChatTransport` and installed chat SDK. It uses
the Surface schema merged through [#2243](https://github.com/recoupable/app/pull/2243)
at `9faf39d56840e008e28bd14ff8197dfb6cec77ab`.

The `data-intelligent-ui-snapshot` name is an experimental fixture, not an enabled
API contract. The test helpers live under `__tests__`; this directory adds no
runtime acceptance, retention or production-chat adapter.

## What the existing application path does

The tests instantiate the real `Chat` with the application's current transport.
Only external `fetch` responses are synthetic. Eight cases characterize:

- Stable-ID replacement beside ordinary streamed text.
- Three reconnect cuts, using the transport's authenticated GET recovery and
  `startIndex` cursor. That cursor counts stream chunks, not Surface revisions.
- Reload of a serialized SDK message followed by replay and stable-ID replacement.
- Byte-at-a-time SSE decoding, including split UTF-8.
- Preservation of reasoning, files and tool outcomes beside the candidate part.
- Opaque data and callback arrival order: the SDK can store an older or
  Surface-invalid candidate while ordinary text and stream completion remain healthy.

That last behavior is a baseline limitation, not revision-aware recovery. The
existing Surface validator rejects the malformed fixture; the SDK does not apply
that domain validator or preserve a highest accepted revision on its own.

Run `pnpm exec vitest run lib/intelligent-ui/transport` to exercise these cases.
No model, customer account or external service is called by this suite.

## Deferred integration

The earlier standalone acceptance/retention prototype and its policy-only tests
were removed after review because no owning application flow consumed them.
[The review finding](https://github.com/recoupable/app/pull/2246#discussion_r4321888981)
is addressed by deferring that engine until it ships with a real consumer.

#2205 still owns validated revision-aware reconciliation, retention, cancellation,
scope changes, local-control continuity, resource bounds and producer compatibility.
#2209 owns coherent rendering on the normal chat path and declares its evidence
and subject-context prerequisites. These tests do not complete either issue.

The app versions exercised are `ai@6.0.241`, `@ai-sdk/react@3.0.243` and
`@workflow/ai@4.2.0`. API SDK-version compatibility, database persistence/concurrency,
renderer behavior, browser/media behavior and latency/resource budgets remain
unverified by this suite. Production feature gates and the parent native criteria
are unchanged.
