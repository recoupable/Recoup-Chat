# Intelligent UI review fixes — October 19, 2026

**Merge gate: HOLD.** The duration-boundary defect is fixed and locally verified,
but native smoke verification of that fix was blocked by URL protocol policy.
Current-head CI/reviews must finish, then Sidney must explicitly approve any merge.
No merge or deployment was invoked. Live-chat work and assessment #2245 are untouched.

## Exact runtime and checks

Runtime: `5d47ecf6dd7b9790151fd0f36ab6dffd7900e9cd`, signed/verified on existing PR #2243.
193 focused tests across 24 files, TypeScript, scoped ESLint, formatting/diff checks
and a production build pass for this runtime. The prior 191-test/native-browser
checkpoint was b3c277c4f; it is not exact-source verification of this new fix.
Subsequent documentation commits do not change runtime; their checks belong on the PR.

The f63bcb802 review completed with three new findings. Saved-end restoration failed
for accepted 47.95s media with a 48s declared timeline. The fix clamps the pending
target to native duration before checking seekability, then synchronizes shared
position after successful seeking. Regressions cover shorter/longer accepted media
(47.95s/48.05s), visible controls, correct Outro notes and no autoplay.

GitHub reported an Actions/Webhooks incident and workflow-processing delays during
the CI queue. Queued jobs without runners are consistent with the incident; a
per-run cause was not established. [Official status](https://www.githubstatus.com/api/v2/summary.json).
Prior green checks do not substitute for the current head. The required-check query
reported no required checks; this does not authorize merging.

## Native evidence and precise new gate

[Historical captures, hashes and final gate](review-evidence/2026-10-19-final/README.md).
At b3c277c4f, native Chromium showed natural unready→ready recovery at 28s paused,
duration 48s, seekable [0,48]; paused click/keyboard jumps, explicit playback,
selection while playing, reload/reopen restoration and failure-note recovery passed.
The original resolver was restored exactly. These are earlier-source observations.

After the new runtime passed its build, the loopback server was restored. Tab URL
metadata reported `http://localhost:3217/labs/intelligent-ui`. A reload was rejected:
URL protocol not allowed; only http/https allowed. The rejected effective protocol
was not disclosed. No alternate navigation, browser surface, raw fetch or policy
bypass was attempted. No new native screenshot or native-boundary pass is claimed.
Next permitted smoke check: restore a saved end with media slightly shorter than
the declared duration, verify visible controls/notes and no autoplay, then recheck
normal section selection/restoration. Forced event-order cases remain DOM tests.

## Review dispositions

[65 assessed-thread ledger](REVIEW-THREADS-2026-10-18.md): the original 48-row table
recounts to 19 fixed, 13 superseded and 16 not adopted; the requested 18/13/17
correction was rejected as inaccurate. The duration finding is fixed, and actual
size guidance is now addressed. Eighteen structural suggestions remain open.

`.coderabbit.yaml` uses a warning-mode custom check that flags functions over 20
lines. Path guidance asks for components under 200 and utility functions under 50,
not lib files under 50. TimelineView (183 lines) and EvidencePanel (197) satisfy
the component threshold. The stream parser/replay hook exceed function guidance;
retaining one owner for reader/cancellation/replay state is an explicit warning
exception with per-file rationale, not absent policy. Tests are excluded by path
filters. Markdown, declarative fixture length and config-file length are not subject
to a universal 100-line file cap there. These suggestions remain technically
nonblocking; this does not imply owner agreement or a complete native/CI pass.

## Next existing dependency, not new scope

[#2205](https://github.com/recoupable/app/issues/2205) carries validated typed data
through WorkflowChatTransport with revision/replay/stop recovery. It explicitly
precedes [#2209](https://github.com/recoupable/app/issues/2209), MessageParts rendering.
Other declared #2209 prerequisites: #2203, #2206, #2207 and #2224. Agent presentation
selection is #2204. None were implemented in this review. The production-gated lab
does not establish live chat, authenticated adapters or second-host portability.
