// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { playgroundScenarios } from "@/lib/intelligent-ui/playground/scenarios";
import { conversationExamples } from "@/lib/intelligent-ui/playground/conversationExamples";
import { getCompletedExample } from "@/lib/intelligent-ui/playground/getCompletedExample";
import PlaygroundWorkspace from "../PlaygroundWorkspace";

const release = playgroundScenarios.find(
  (scenario) => scenario.id === "release",
)!;
const sourcing = playgroundScenarios.find(
  (scenario) => scenario.id === "sourcing",
)!;
const releaseExample = conversationExamples.find(
  (example) => example.id === "release-review",
)!;
const supplierExample = conversationExamples.find(
  (example) => example.id === "supplier-comparison",
)!;
const simpleExample = conversationExamples.find(
  (example) => example.id === "simple-answer",
)!;
const fetchMock = vi.fn();

beforeEach(() => {
  localStorage.clear();
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
});

describe("PlaygroundWorkspace", () => {
  it("rejects a valid but changed replay rather than combining new values with an old authored answer", async () => {
    const changed = structuredClone(getCompletedExample(sourcing));
    changed.title = "A different supplier comparison";
    const quotes = changed.components.find(
      (item) => item.type === "collection",
    );
    if (quotes?.type !== "collection")
      throw new Error("Missing supplier fixture");
    quotes.rows.find((row) => row.id === "common-ground")!.values.lead =
      "2 days";
    const frames = [
      { type: "surface.snapshot", surface: changed },
      {
        type: "surface.complete",
        surfaceId: changed.id,
        revision: changed.revision,
      },
    ];
    fetchMock.mockResolvedValueOnce({
      ok: true,
      body: new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(
            new TextEncoder().encode(
              frames.map((frame) => JSON.stringify(frame)).join("\n") + "\n",
            ),
          );
          controller.close();
        },
      }),
    });
    render(
      <PlaygroundWorkspace scenario={sourcing} example={supplierExample} />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Draft sample request" }),
    );
    const editor = screen.getByRole("textbox", {
      name: "Follow-up draft",
    }) as HTMLTextAreaElement;
    fireEvent.change(editor, { target: { value: "Keep this request." } });
    fireEvent.click(screen.getByText("About this example"));
    fireEvent.click(screen.getByRole("button", { name: "Replay updates" }));
    expect((await screen.findByRole("alert")).textContent).toBe(
      "Replay data differs from the authored example. The original answer is still shown.",
    );
    const commonGround = within(screen.getByRole("table"))
      .getByRole("rowheader", { name: "Common Ground" })
      .closest("tr")!;
    expect(within(commonGround).getByText("14 days")).toBeTruthy();
    expect(within(commonGround).queryByText("2 days")).toBeNull();
    expect(screen.getByText(supplierExample.answer)).toBeTruthy();
    expect(editor.value).toBe("Keep this request.");
  });

  it("leads with an answer and one useful collection, with only the two release follow-ups visible", () => {
    render(<PlaygroundWorkspace scenario={release} example={releaseExample} />);
    const response = screen.getByRole("article", { name: "Recoup response" });
    const answer = within(response).getByText(releaseExample.answer);
    const collection = within(response).getByRole("region", {
      name: releaseExample.inlineTitle,
    });
    expect(
      answer.compareDocumentPosition(collection) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).not.toBe(0);
    expect(within(response).getAllByRole("region")).toHaveLength(1);
    const table = within(response).getByRole("table");
    expect(
      within(table)
        .getAllByRole("rowheader")
        .map((element) => element.textContent),
    ).toEqual(["After Hours", "Daybreak"]);
    expect(
      within(table)
        .getAllByRole("columnheader")
        .map((element) => element.textContent),
    ).toEqual(["Track", "Next step", "Owner", "Sources"]);
    expect(within(response).queryByRole("checkbox")).toBeNull();
    expect(within(response).queryByRole("textbox")).toBeNull();
    expect(within(response).queryByText("At a glance")).toBeNull();
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reveals all tracks only when requested and returns to the focused follow-up view", () => {
    render(<PlaygroundWorkspace scenario={release} example={releaseExample} />);
    fireEvent.click(screen.getByRole("button", { name: "View all 4 tracks" }));
    expect(
      within(screen.getByRole("table"))
        .getAllByRole("rowheader")
        .map((element) => element.textContent),
    ).toEqual(["Glasshouse", "Low Tide", "After Hours", "Daybreak"]);
    fireEvent.click(
      screen.getByRole("button", { name: "Show follow-ups only" }),
    );
    expect(
      within(screen.getByRole("table")).getAllByRole("rowheader"),
    ).toHaveLength(2);
  });

  it("leaves a simple answer as text with an accessible source, without adding a generated surface or task CTA", async () => {
    render(<PlaygroundWorkspace scenario={release} example={simpleExample} />);
    const response = screen.getByRole("article", { name: "Recoup response" });
    expect(within(response).getByText(simpleExample.answer)).toBeTruthy();
    expect(within(response).queryByRole("region")).toBeNull();
    expect(within(response).queryByRole("table")).toBeNull();
    expect(within(response).getAllByRole("button")).toHaveLength(1);
    const source = within(response).getByRole("button", {
      name: "Delivery sheet · revision 3",
    });
    source.focus();
    fireEvent.click(source);
    expect(
      await screen.findByRole("dialog", { name: "Source details" }),
    ).toBeTruthy();
    fireEvent.keyDown(document.activeElement!, { key: "Escape" });
    await waitFor(() => expect(document.activeElement).toBe(source));
  });

  it("presents all three suppliers and preserves the source's actual tradeoffs", () => {
    render(
      <PlaygroundWorkspace scenario={sourcing} example={supplierExample} />,
    );
    const response = screen.getByRole("article", { name: "Recoup response" });
    const table = within(response).getByRole("table");
    expect(
      within(table)
        .getAllByRole("rowheader")
        .map((element) => element.textContent),
    ).toEqual(["Northline", "Common Ground", "Fieldwork"]);
    const fieldwork = within(table)
      .getByRole("rowheader", { name: "Fieldwork" })
      .closest("tr")!;
    expect(within(fieldwork).getByText("$2,250")).toBeTruthy();
    expect(within(fieldwork).getByText("28 days")).toBeTruthy();
    expect(within(fieldwork).getByText("Sample pending")).toBeTruthy();
    expect(within(response).getByText(supplierExample.answer)).toBeTruthy();
  });

  it("keeps an edited draft when closed, when the collection expands, and after remount", async () => {
    const first = render(
      <PlaygroundWorkspace scenario={release} example={releaseExample} />,
    );
    const trigger = screen.getByRole("button", { name: "Draft follow-up" });
    fireEvent.click(trigger);
    const editor = screen.getByRole("textbox", { name: "Follow-up draft" });
    await waitFor(() => expect(document.activeElement).toBe(editor));
    fireEvent.change(editor, {
      target: {
        value:
          "Please check the missing material by Friday.\nKeep this wording.",
      },
    });
    fireEvent.click(screen.getByRole("button", { name: "Close draft" }));
    expect(document.activeElement).toBe(trigger);
    fireEvent.click(screen.getByRole("button", { name: "View all 4 tracks" }));
    fireEvent.click(trigger);
    expect(
      (
        screen.getByRole("textbox", {
          name: "Follow-up draft",
        }) as HTMLTextAreaElement
      ).value,
    ).toBe("Please check the missing material by Friday.\nKeep this wording.");
    first.unmount();
    render(<PlaygroundWorkspace scenario={release} example={releaseExample} />);
    expect(screen.queryByRole("textbox")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Draft follow-up" }));
    expect(
      (
        screen.getByRole("textbox", {
          name: "Follow-up draft",
        }) as HTMLTextAreaElement
      ).value,
    ).toBe("Please check the missing material by Friday.\nKeep this wording.");
  });

  it("keeps an intentionally cleared draft empty after closing, reopening, and remounting", () => {
    const first = render(
      <PlaygroundWorkspace scenario={release} example={releaseExample} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Draft follow-up" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Follow-up draft" }), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Close draft" }));
    fireEvent.click(screen.getByRole("button", { name: "Draft follow-up" }));
    expect(
      (
        screen.getByRole("textbox", {
          name: "Follow-up draft",
        }) as HTMLTextAreaElement
      ).value,
    ).toBe("");
    first.unmount();
    render(<PlaygroundWorkspace scenario={release} example={releaseExample} />);
    fireEvent.click(screen.getByRole("button", { name: "Draft follow-up" }));
    expect(
      (
        screen.getByRole("textbox", {
          name: "Follow-up draft",
        }) as HTMLTextAreaElement
      ).value,
    ).toBe("");
  });

  it("restores focus to stable source buttons after both direct inspection and a popover-to-dialog handoff", async () => {
    render(<PlaygroundWorkspace scenario={release} example={releaseExample} />);
    const list = screen.getByRole("list", {
      name: "Night Swimming · follow-ups records",
    });
    const single = within(list).getByRole("button", {
      name: "Inspect 1 source for After Hours",
    });
    fireEvent.click(single);
    let dialog = await screen.findByRole("dialog", { name: "Source details" });
    await waitFor(() =>
      expect(dialog.contains(document.activeElement)).toBe(true),
    );
    fireEvent.click(
      within(dialog).getByRole("button", { name: "Close evidence inspector" }),
    );
    await waitFor(() => expect(document.activeElement).toBe(single));

    const multiple = within(list).getByRole("button", {
      name: "2 sources for Daybreak",
    });
    multiple.focus();
    fireEvent.click(multiple);
    const choices = await screen.findByRole("dialog", {
      name: "Sources for Daybreak",
    });
    fireEvent.click(
      within(choices).getByRole("button", { name: /Contributor follow-up/ }),
    );
    dialog = await screen.findByRole("dialog", { name: "Source details" });
    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", { name: "Sources for Daybreak" }),
      ).toBeNull(),
    );
    await waitFor(() =>
      expect(dialog.contains(document.activeElement)).toBe(true),
    );
    fireEvent.keyDown(document.activeElement!, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(multiple));
  });

  it("does not open or focus a restored source automatically", () => {
    const subject = release.initial.context.subject;
    localStorage.setItem(
      `recoup:iui:fixture-v1:${release.initial.context.workspaceId}:${subject.kind}:${subject.id}`,
      JSON.stringify({
        selectedRowIds: [],
        filter: "",
        notes: "Saved note",
        evidenceId: "delivery-sheet",
      }),
    );
    const { rerender } = render(<button>Keep my focus</button>);
    const control = screen.getByRole("button", { name: "Keep my focus" });
    control.focus();
    rerender(
      <>
        <button>Keep my focus</button>
        <PlaygroundWorkspace scenario={release} example={releaseExample} />
      </>,
    );
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(control);
  });

  it("retains the coherent answer, collection, and draft after a stopped replay and a malformed replay", async () => {
    const encoder = new TextEncoder();
    const cancel = vi.fn();
    fetchMock.mockResolvedValueOnce({
      ok: true,
      body: new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(
            encoder.encode(`${JSON.stringify(release.events[0])}\n`),
          );
        },
        cancel,
      }),
    });
    render(<PlaygroundWorkspace scenario={release} example={releaseExample} />);
    fireEvent.click(screen.getByRole("button", { name: "Draft follow-up" }));
    const editor = screen.getByRole("textbox", {
      name: "Follow-up draft",
    }) as HTMLTextAreaElement;
    fireEvent.change(editor, {
      target: { value: "Preserve this working draft." },
    });
    fireEvent.click(screen.getByText("About this example"));
    fireEvent.click(screen.getByRole("button", { name: "Replay updates" }));
    const stop = await screen.findByRole("button", { name: "Stop replay" });
    fireEvent.click(stop);
    await waitFor(() => expect(cancel).toHaveBeenCalled());
    expect(
      screen.getByText("Replay stopped. The current answer is unchanged."),
    ).toBeTruthy();
    expect(screen.getByText(releaseExample.answer)).toBeTruthy();
    expect(
      within(screen.getByRole("table")).getAllByRole("rowheader"),
    ).toHaveLength(2);
    expect(editor.value).toBe("Preserve this working draft.");

    fetchMock.mockResolvedValueOnce({
      ok: true,
      body: new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(
            encoder.encode(
              `${JSON.stringify(release.events[0])}\n{"type":"not-valid"}\n`,
            ),
          );
          controller.close();
        },
      }),
    });
    fireEvent.click(screen.getByRole("button", { name: "Replay updates" }));
    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(
      screen.getByText("Replay interrupted. The current answer is unchanged."),
    ).toBeTruthy();
    expect(screen.getByText(releaseExample.answer)).toBeTruthy();
    expect(
      within(screen.getByRole("table")).getAllByRole("rowheader"),
    ).toHaveLength(2);
    expect(editor.value).toBe("Preserve this working draft.");
  });
});
