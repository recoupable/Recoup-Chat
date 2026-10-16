# Intelligent UI: conversation first

Research checked October 16, 2026. This records the rationale and evaluation plan
for the playground redesign, not validated outcomes for Recoup.

## Decision and scope

Make the answer primary. Add one compact inline collection only when it helps the
person compare, select, or inspect information. A useful answer may contain no
generated interface. The four component types in the protocol are data-contract
capabilities, not a requirement to display four components in every response. This
redesign renders collections and falls back to text; it removes the unused metric,
summary, and checklist widgets from the visual catalog.

The specimen follows the reading rhythm of Recoup chat: a user question, a concise
assistant answer and an optional interactive object. An explicit **Draft follow-up**
button opens an authored, editable local draft for the current example. There is
no record-selection control. The draft can be copied; it does not send a message,
call a model, execute a tool, or authorize a business operation.

This remains a synthetic demonstration backed by bundled fixtures and paced NDJSON.
It is not a live chat integration, model-driven producer, MCP UI integration, or
published SDK. Fixture claims are fictional. No interface state grants production
authority, accepts a company record, approves a release, or places an order.

## Evidence and its limits

The following are primary research sources. Publication status, study population,
comparison, and measured outcome matter more than a headline preference score.
The design decisions below are our inferences, not findings that these studies
tested on Recoup.

| Source                                                                                                                                                                          | Evidence                                                                                                                                                                                                                                                                                       | Limits and relevance                                                                                                                                                                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Generative Interfaces for Language Models, Findings of ACL 2026](https://aclanthology.org/2026.findings-acl.74.pdf), sections 3.3, 4.3–4.4 and Limitations. Peer reviewed.     | The synthetic benchmark used 100 queries and 428 annotators. A separate evaluation used 380 self-authored queries from 76 people: GenUI won 50.8%, tied 8.2%, and lost 41.1%. Authors identify simple how-to cases where text was preferable.                                                  | These are pairwise preferences, not verified task accuracy or completion-time gains. Their discussion of cognitive load partly derives from comments. Generating UI for every query is an acknowledged limitation. Polished presentation also increased perceived authority, which does not establish correctness. |
| [DuetUI, CHI 2026 author version v2](https://arxiv.org/html/2509.13444v2), sections 7–8. Peer reviewed; DOI [10.1145/3772318.3790441](https://doi.org/10.1145/3772318.3790441). | Within-subject study with 24 participants comparing DuetUI and Stitch. SUS was 73.65 versus 63.47. Prompting duration was 20.12s versus 49.37s. Overall task duration, 188.38s versus 195.38s, was not significantly different; neither was overall NASA-TLX workload.                         | Campus recruitment, ages 18–31, short sessions. The benefit is more specific than “generated UI makes tasks faster”: interaction reduced prompting effort and improved perceived usability. The February 2026 revision adds behavioral analysis absent from the original preprint.                                 |
| [Bridging Gulfs in UI Generation through Semantic Guidance, CHI 2026](https://www.seokhyeon.com/chi26-uigeneration.pdf), section 6. Peer reviewed author copy.                  | Fourteen designers, engineers, and product managers used both a semantic interface and a chat baseline with the same generation model. Perceived intent expressiveness and output interpretability improved. Participants valued scoped edits and described unrelated changes in the baseline. | This concerns practitioners generating UI designs, not end users reading AI answers. Several participants found the information density initially difficult. It supports investigating predictable changes and progressive disclosure, not a universal layout prescription.                                        |
| [Generative and Malleable User Interfaces / Jelly, CHI 2025](https://arxiv.org/html/2503.04084v1), section 8. Peer reviewed author version.                                     | Eight participants completed a tutorial and two self-chosen information tasks in approximately 80-minute sessions. Participants valued persistent structures, localized modifications, and traceable history; repeatedly describing incremental changes could be tedious.                      | Small exploratory study, daily AI users, no controlled task-performance baseline. Its evidence motivates continuity and lightweight refinement; it does not prove a dashboard is better than a concise answer.                                                                                                     |
| [DirectGPT, CHI 2024](https://damienmasson.com/pdfs/directgpt.pdf), sections 4–5. Peer reviewed, older supporting evidence.                                                     | Twelve participants with programming and ChatGPT experience completed 288 text/code/vector editing tasks. Direct manipulation produced approximately 50% faster completion, 50% fewer prompts, and 72% shorter prompts. Participants still used prompting for global changes.                  | GPT-3.5, technical participants, localized editing tasks. This is task-performance evidence for targeting and reversible manipulation, not evidence for ornamental summaries, metric cards, or every task becoming a mini-application.                                                                             |

## Official guidance is not an independent user study

- [OpenAI: GPT-6 and Intelligent UI for everyone, October 7, 2026](https://openai.com/index/gpt-6-for-everyone/)
  describes combining prose, visuals, and interaction according to the question,
  including choosing plain text when sufficient. It describes native streamable
  components and progressive compilation. This is a first-party product and
  implementation account, not evidence that Recoup has the same runtime, training,
  design quality, or user outcomes. It does not publish a reusable Intelligent UI
  compiler contract for this prototype.
- [OpenAI plugin UI guidelines](https://developers.openai.com/plugins/concepts/ui-guidelines)
  recommend optional, focused UI that improves a conversational workflow, limited
  actions, preserved edits, shallow navigation, and accessibility. They discourage
  nested scrolling and duplicating the host's inputs. These are platform design
  guidelines, not experimental findings. Their current inline widget ordering is
  specific to ChatGPT; our native Recoup specimen deliberately places the primary
  answer first. We retain Recoup's tokens and typography rather than importing a
  different host's visual identity.
- [OpenAI: What makes a great ChatGPT app, November 24, 2025](https://developers.openai.com/blog/what-makes-a-great-chatgpt-app)
  frames app value as specific capabilities introduced at a relevant moment in a
  conversation. This supports a small interaction surface rather than porting a
  complete navigation hierarchy. It is vendor design guidance, not comparative
  usability evidence.

## Before and after

These are Recoup design decisions proposed from the evidence and the existing
chat layout. They should be evaluated, not presented as experimentally optimal.

| Previous demonstration                                             | Redesign decision                                                                   | Reason                                                                         |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Large marketing hero, 1440px canvas, independent workspace framing | A narrow conversation specimen aligned with the app's `MessageFrame` reading column | Start with the user's question and answer; avoid learning a separate workspace |
| Summary, metric cards, table, and checklist on every scenario      | Concise answer plus at most one useful inline collection by default                 | Remove repeated facts and competing visual hierarchies                         |
| Text view replaces the visual view                                 | Prose remains alongside optional UI; retain an accessible text representation       | Explanation, qualification, and interaction serve different purposes           |
| Permanent evidence and notes sidebar                               | Sources disclose on request near the claim; follow-up draft appears when relevant   | Keep contextual information available without occupying a permanent rail       |
| Search and selection counts before any intent to manipulate        | Offer controls only when record volume or a concrete next step warrants them        | A checkbox with no meaningful consequence is extra work                        |
| Repeated category, revision, component labels, and JSON            | Quiet lab controls; technical details remain secondary                              | Implementation details should not interrupt the answer                         |
| Full-screen dashboard identity                                     | Existing app type, color, spacing, and focus conventions                            | The result should feel like part of the conversation                           |

## Selectivity policy

The host chooses presentation; a domain pack supplies records and evidence. Avoid
putting music-specific decisions inside the portable renderer.

1. **Answer first.** Give the result and important qualification in ordinary prose.
   Do not withhold the answer until the user explores a widget.
2. **Use text alone** for a simple fact, short explanation, clarification, or brief
   sequence whose meaning is already clear. A single number does not require a
   metric card. A list of next steps does not automatically require a checklist.
3. **Add one compact collection** when aligned attributes or record-specific
   selection make a concrete task easier. Choose only the columns required for
   the current decision. Do not render the entire available domain schema.
4. **Expand intentionally.** More records, more fields, or a larger workspace are
   user-directed disclosures. A follow-up question may change the representation;
   ordinary data arrival should not unexpectedly rebuild it.
5. **Keep conversation available.** In a future live integration, a person should
   be able to continue in words instead of operating the UI. This specimen has no
   conversation composer: its task-specific button opens a local draft with
   visible subject identities. Record selection may be a future pattern when it
   has a concrete consequence. No automatic send or execution.

For release readiness, lead with the two unresolved materials and distinguish
readiness for review from approval. A compact exception list can expose sources
and prepare a follow-up; all four tracks need not occupy the initial answer.
For supplier comparison, aligned quote, lead-time, and review fields earn space.
For “How many tracks are in this example?”, the answer can simply be “Four.”

The one-collection limit is a default for this specimen, not a universal limit on
the contract or a claim that complex future tasks never need a larger surface.

## Interaction constraints

### Evidence without a permanent dashboard

- Attach a small, clearly labelled source affordance to the relevant claim or row.
  Reveal the source list and details on request; avoid repeating full source text
  below every representation.
- Keep source identity, time, kind, and completeness available in the disclosure.
  Missing, partial, proposed, and withdrawn evidence must remain distinguishable.
- Open details without losing conversational context. Closing restores the trigger's
  focus. A restored source selection must not steal focus on page load.
- A polished card is not confirmation. Collection completeness, stream completion,
  evidentiary support, and permission to act remain different states.

### Predictable streaming

The current conversation begins with a completed, validated bundled fixture.
Replay exposes incoming revisions only inside the optional technical disclosure.
The host accepts a replayed document after the complete event **and** clean stream
EOF, and only if the whole document matches the fixture associated with its
authored answer and draft. A changed or invalid replay leaves that baseline in
place. This guards fixture coherence; it is not a general live producer protocol
or a demonstration of progressive visible answer rendering.

The following are constraints for future progressive integration, not claims that
the current buffered specimen has validated that experience:

- Update stable objects in place. Preserve selection, draft text, focus, and the
  user's reading position. Never replace user edits with streamed content.
- Do not automatically reorder rows, reveal a new sidebar, or move controls under
  the pointer while a person is interacting. Signal meaningful changes quietly.
- Keep the last validated view available on interruption. Stop and retry are
  explicit; older requests must not overwrite a newer scenario or replay.
- Partial records must look partial. Receiving the final event does not prove a
  complete source, current quote, accepted finding, or authorized operation.
- Selection changes and local drafts are reversible. Any future business action
  requires its own authorized server path and truthful outcome/receipt handling.

### Mobile and accessibility

- Preserve the conversation's single reading axis. Fit the relevant fields to the
  viewport; use labelled stacked rows when that retains comparison meaning.
  Avoid a permanent rail, deep card navigation, or nested vertical scrollers.
- If a real comparison cannot reflow without losing meaning, provide a labelled,
  keyboard-reachable horizontal table region and a readable text alternative.
  Treat this as an exception to test, not the default mobile presentation.
- Keep native labelled controls, visible focus, logical heading order, table
  semantics where applicable, and status words that do not depend on color.
- Test text resizing, light/dark contrast, narrow screens, keyboard use, and a
  screen reader. Use comfortable touch targets and respect reduced motion.
- Announce meaningful status changes, not every arriving cell. Do not move focus
  for unsolicited updates. Disclosures must expose expanded state and usable
  close/return behavior.

## Proposed evaluation — not run

No participant study or comparative usability result has been produced for this
redesign. Browser checks and automated tests establish behavior, not user benefit.
This research plan is not a new approval or release gate.

### Conditions and procedure

Compare **A: concise text only** with **B: the same answer plus one compact
interactive collection where useful**. A may use normal headings and bullets; it
must be a good text answer, not an intentionally weak baseline. Both conditions
provide the same facts, qualifications, source contents, and an equally available
way to draft a follow-up. In the current specimen, an explicit button opens the
same authored draft for editing; neither condition sends it. A later study of
record selection requires implementing that interaction first. The simple-fact
task should select text-only presentation in both.

Start with a formative target of 12–16 participants spanning release coordination
and operations experience, including nontechnical users. This is a proposed
recruitment target, not a completed sample or a statistically powered experiment.
Counterbalance condition order and use matched synthetic task variants to reduce
answer memorization. Include desktop and mobile sessions; arrange keyboard and
screen-reader coverage rather than inferring accessibility from mouse users.

Use identical content and controlled delivery timing. Record both time from the
first useful answer to a submitted response and total time including delivery.
Ask participants to answer before collecting preference ratings. Observe task
failures and recovery; do not coach participants through the interface.

| Task                                                                                | Expected outcome and scoring                                                                                                                                                                      |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Release: identify what prevents review and prepare a scoped follow-up               | Identify missing artwork and contributor confirmation, preserve the correct track identities in the draft, and avoid claiming release approval. Score each fact and identity against the fixture. |
| Supplier: compare the shortest lead time with the lowest quote and inspect the gap  | Correctly distinguish the fastest and cheapest suppliers, identify the missing sample review, and avoid treating a submitted quote as a purchase authorization.                                   |
| Simple fact: ask how many tracks are in the example                                 | Correct answer with no mandatory widget interaction. Record unnecessary clicks, disclosure, or navigation.                                                                                        |
| Source check: verify one claim using partial evidence                               | Locate the supporting source and correctly explain what it does and does not establish. Opening a source alone is not a successful verification.                                                  |
| Replay: open and edit a draft while fixture revisions arrive in the diagnostic view | Preserve the draft and focus while the visible answer stays unchanged. Repeat with stop/retry and a scenario switch. This evaluates buffered continuity, not noticing a changing answer.          |

### Measures and decision rule

- **Accuracy:** correct facts, subject identities, qualifications, and absence of
  unsupported approval claims. Report errors separately from successful speed.
- **Time:** task completion time among correct responses, first-useful-answer
  latency, time spent finding a source, and completion/failure rates.
- **Effort:** prompts typed, unnecessary navigation, reversals, and separate
  seven-point ratings of task difficulty and mental effort. These custom ratings
  are not a validated cognitive-load instrument or a NASA-TLX score.
- **Source checking:** successful claim-to-source matching and recognition of
  incomplete evidence. Also record whether participants overtrust visual polish.
- **Continuity and access:** lost edits, focus jumps, mistaken row targets,
  keyboard/screen-reader blockers, and narrow-screen reading failures.
- **Preference:** collect last, with an explanation; keep it separate from
  performance and correctness.

Before sessions, freeze task rubrics, delivery timing, exclusion rules, and the
analysis plan. Report per-task paired differences and individual failures;
describe uncertainty and avoid significance claims from an underpowered sample.
Retain an interactive pattern when the evidence suggests a concrete speed or
effort benefit without an observed accuracy, source-checking, or access penalty.
Remove or revise it when it adds work or hides qualifications. An inconclusive
result is inconclusive, not proof that more UI is better.

## Implementation handoff

The host redesign should preserve the existing validation, stable identities,
revision checks, abort behavior, scoped storage, and production availability gate.
It changes which information receives attention, not who is allowed to act.
Keep the research/selectivity layer separate from the domain data and the pure
renderer so future hosts can apply their own display and capability constraints.

This remains a bounded first specimen. It does not complete the epic's live chat
transport integration, progressive visible streaming, authorized source binding,
cross-device persistence, second host adapter, or action receipt requirements.
Those need their own implementation and evidence; a quiet synthetic example and
passing protocol tests do not establish them.
