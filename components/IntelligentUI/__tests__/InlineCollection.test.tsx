// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import type { Evidence, SurfaceComponent } from "@/lib/intelligent-ui/schema";
import InlineCollection from "../InlineCollection";

afterEach(cleanup);

const component: Extract<SurfaceComponent, { type: "collection" }> = {
  type: "collection",
  id: "follow-ups",
  title: "Release follow-ups",
  columns: [
    { key: "next", label: "Next step" },
    { key: "owner", label: "Owner" },
  ],
  rows: [
    {
      id: "artwork",
      label: "After Hours",
      values: { next: "Artwork needed", owner: "Jules" },
      evidenceIds: ["sheet", "note"],
    },
    {
      id: "confirmation",
      label: "Daybreak",
      values: { next: "Contributor confirmation" },
      evidenceIds: ["note"],
    },
  ],
  complete: true,
  totalCount: 2,
};

const evidence: Evidence[] = [
  {
    id: "sheet",
    label: "Delivery sheet",
    sourceLabel: "Example worksheet",
    observedAt: "2026-10-16T12:00:00Z",
    kind: "submitted",
    status: "current",
    text: "Synthetic materials list.",
  },
  {
    id: "note",
    label: "Contributor note",
    sourceLabel: "Example review",
    observedAt: "2026-10-16T12:00:00Z",
    kind: "observed",
    status: "partial",
    text: "Synthetic confirmation note.",
  },
];

describe("InlineCollection", () => {
  it.each(["constructor", "toString"])(
    "does not render an inherited object property for missing column %s",
    (key) => {
      render(
        <InlineCollection
          component={{
            ...component,
            columns: [{ key, label: "Optional field" }],
            rows: [{ ...component.rows[0], values: {}, evidenceIds: [] }],
            totalCount: 1,
          }}
        />,
      );
      expect(screen.getAllByText("Not provided")).toHaveLength(2);
    },
  );

  it("preserves incomplete original coverage when the requested projection is complete", () => {
    render(<InlineCollection component={component} sourceComplete={false} />);
    const notice = screen.getByText(
      "Original collection is incomplete; this view contains only the requested records.",
    );
    expect(
      screen
        .getByRole("region", { name: component.title })
        .getAttribute("aria-describedby"),
    ).toBe(notice.id);
    expect(screen.queryByText(/Partial collection ·/)).toBeNull();
    expect(screen.queryByText(/2 of/)).toBeNull();
  });

  it("provides a semantic desktop table and a labelled mobile list without a horizontal scroller", () => {
    const { container } = render(
      <InlineCollection component={component} evidence={evidence} />,
    );
    const table = screen.getByRole("table", { name: component.title });
    expect(
      within(table)
        .getAllByRole("columnheader")
        .map((element) => element.textContent),
    ).toEqual(["Record", "Next step", "Owner", "Sources"]);
    expect(
      within(table)
        .getAllByRole("rowheader")
        .map((element) => element.textContent),
    ).toEqual(["After Hours", "Daybreak"]);
    const list = screen.getByRole("list", {
      name: "Release follow-ups records",
    });
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(
      within(items[0]).getByRole("heading", { name: "After Hours" }),
    ).toBeTruthy();
    expect(items[0].querySelector("dt")?.textContent).toBe("Next step");
    expect(items[0].querySelector("dd")?.textContent).toBe("Artwork needed");
    expect(within(items[1]).getByText("Not provided")).toBeTruthy();
    expect(container.querySelector("section")?.className).toContain(
      "@container",
    );
    expect(table.parentElement?.className).toContain("@min-[560px]:block");
    expect(list.className).toContain("@min-[560px]:hidden");
    expect(container.querySelector('[class*="overflow-x"]')).toBeNull();
    expect(screen.queryByRole("checkbox")).toBeNull();
    expect(screen.queryByRole("textbox")).toBeNull();
  });

  it("shows one source-count control per row and opens every source through the persistent trigger", async () => {
    const onInspectEvidence = vi.fn();
    render(
      <InlineCollection
        component={component}
        evidence={evidence}
        onInspectEvidence={onInspectEvidence}
      />,
    );
    const list = screen.getByRole("list", {
      name: "Release follow-ups records",
    });
    expect(within(list).getAllByRole("button")).toHaveLength(2);
    const trigger = within(list).getByRole("button", {
      name: "2 sources for After Hours",
    });
    trigger.focus();
    fireEvent.click(trigger);
    const choices = await screen.findByRole("dialog", {
      name: "Sources for After Hours",
    });
    expect(within(choices).getAllByRole("button")).toHaveLength(2);
    fireEvent.click(
      within(choices).getByRole("button", { name: /Contributor note/ }),
    );
    expect(onInspectEvidence).toHaveBeenCalledWith("note", trigger);
    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", { name: "Sources for After Hours" }),
      ).toBeNull(),
    );
    expect(trigger.isConnected).toBe(true);
    const single = within(list).getByRole("button", {
      name: "Inspect 1 source for Daybreak",
    });
    fireEvent.click(single);
    expect(onInspectEvidence).toHaveBeenLastCalledWith("note", single);
  });

  it("supports Escape without inspecting a source and returns focus to the source trigger", async () => {
    const onInspectEvidence = vi.fn();
    render(
      <InlineCollection
        component={component}
        evidence={evidence}
        onInspectEvidence={onInspectEvidence}
      />,
    );
    const list = screen.getByRole("list", {
      name: "Release follow-ups records",
    });
    const trigger = within(list).getByRole("button", {
      name: "2 sources for After Hours",
    });
    trigger.focus();
    fireEvent.click(trigger);
    const choices = await screen.findByRole("dialog", {
      name: "Sources for After Hours",
    });
    fireEvent.keyDown(choices, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
    expect(onInspectEvidence).not.toHaveBeenCalled();
  });

  it("deduplicates partial and withdrawn evidence warnings across rows", () => {
    render(
      <InlineCollection
        component={component}
        evidence={[{ ...evidence[0], status: "withdrawn" }, evidence[1]]}
      />,
    );
    expect(
      screen.getAllByText("1 partial source · 1 withdrawn source"),
    ).toHaveLength(1);
    expect(screen.queryByText(/Includes partial evidence/)).toBeNull();
  });

  it("keeps partial collections explicit and empty complete collections quiet", () => {
    const { rerender } = render(
      <InlineCollection
        component={{ ...component, rows: [], complete: false, totalCount: 4 }}
      />,
    );
    expect(screen.getByText("No records available.")).toBeTruthy();
    expect(
      screen.getByText("Partial collection · 0 of 4 records available."),
    ).toBeTruthy();
    rerender(
      <InlineCollection
        component={{ ...component, rows: [], complete: true, totalCount: 0 }}
      />,
    );
    expect(screen.getByText("No records in this view.")).toBeTruthy();
    expect(screen.queryByText(/Partial collection/)).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("preserves source control identity and focus when streamed rows are reordered", () => {
    const onInspectEvidence = vi.fn();
    const { rerender } = render(
      <InlineCollection
        component={component}
        evidence={evidence}
        onInspectEvidence={onInspectEvidence}
      />,
    );
    const list = screen.getByRole("list", {
      name: "Release follow-ups records",
    });
    const trigger = within(list).getByRole("button", {
      name: "Inspect 1 source for Daybreak",
    });
    trigger.focus();
    rerender(
      <InlineCollection
        component={{ ...component, rows: [...component.rows].reverse() }}
        evidence={evidence}
        onInspectEvidence={onInspectEvidence}
      />,
    );
    expect(
      within(list).getByRole("button", {
        name: "Inspect 1 source for Daybreak",
      }),
    ).toBe(trigger);
    expect(document.activeElement).toBe(trigger);
  });

  it("omits empty evidence controls and renders supplied content as inert text", () => {
    const text = '<img src="x" onerror="alert(1)">';
    render(
      <InlineCollection
        component={{
          ...component,
          rows: [{ ...component.rows[0], label: text, evidenceIds: [] }],
          totalCount: 1,
        }}
      />,
    );
    expect(screen.getAllByText(text)).toHaveLength(2);
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByText("No sources attached")).toBeNull();
  });

  it("falls back to labelled fields for many columns rather than squeezing a wide table", () => {
    render(
      <InlineCollection
        component={{
          ...component,
          columns: [
            ...component.columns,
            { key: "date", label: "Date" },
            { key: "status", label: "Status" },
          ],
        }}
      />,
    );
    expect(screen.queryByRole("table")).toBeNull();
    const list = screen.getByRole("list", {
      name: "Release follow-ups records",
    });
    expect(list.className).not.toContain("hidden");
    expect(within(list).getAllByText("Date")).toHaveLength(2);
  });
});
