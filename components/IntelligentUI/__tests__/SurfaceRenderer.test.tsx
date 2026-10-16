// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import type { CollectionComponent, Surface } from "@/lib/intelligent-ui/schema";
import SurfaceRenderer from "../SurfaceRenderer";

afterEach(cleanup);

const collection: CollectionComponent = {
  id: "records",
  type: "collection",
  title: "Review queue",
  columns: [{ key: "owner", label: "Owner" }],
  complete: false,
  totalCount: 4,
  rows: [
    {
      id: "record-a",
      label: "Launch brief",
      values: { owner: "Avery" },
      evidenceIds: ["evidence-a", "evidence-b"],
    },
    { id: "record-b", label: "Schedule", values: {}, evidenceIds: [] },
  ],
};

const surface: Surface = {
  schemaVersion: 1,
  id: "surface-example",
  revision: 0,
  title: "Example workspace",
  description: "A synthetic review queue.",
  context: {
    workspaceId: "example",
    subject: { kind: "project", id: "demo", label: "Demo project" },
  },
  components: [collection],
  evidence: ["evidence-a", "evidence-b"].map((id) => ({
    id,
    label: id,
    sourceLabel: "Synthetic example",
    observedAt: "2026-10-16T12:00:00Z",
    kind: "submitted",
    status: "current",
    text: "Example source.",
  })),
  fallbackText: "A synthetic review queue is available.",
};

const props = {
  surface,
  selectedRowIds: ["record-a"],
  onSelectRow: vi.fn(),
  onInspectEvidence: vi.fn(),
  filter: "",
};

describe("SurfaceRenderer", () => {
  it("keeps a named region without repeating the workspace heading when embedded", () => {
    render(<SurfaceRenderer {...props} showHeading={false} />);
    expect(screen.getByRole("region", { name: surface.title })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: surface.title })).toBeNull();
    expect(screen.queryByText(surface.description)).toBeNull();
  });

  it("uses labelled native selection controls and preserves row identity across reordered revisions", () => {
    const onSelectRow = vi.fn();
    const { rerender } = render(
      <SurfaceRenderer {...props} onSelectRow={onSelectRow} />,
    );
    const checkbox = screen.getByRole("checkbox", {
      name: "Select Launch brief",
    }) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
    checkbox.focus();
    expect(document.activeElement).toBe(checkbox);
    fireEvent.click(checkbox);
    expect(onSelectRow).toHaveBeenCalledWith("record-a");
    rerender(
      <SurfaceRenderer
        {...props}
        surface={{
          ...surface,
          revision: 1,
          components: [{ ...collection, rows: [...collection.rows].reverse() }],
        }}
      />,
    );
    expect(screen.getByRole("checkbox", { name: "Select Launch brief" })).toBe(
      checkbox,
    );
    expect(document.activeElement).toBe(checkbox);
  });

  it("inspects each referenced source without toggling row selection", () => {
    const onSelectRow = vi.fn();
    const onInspectEvidence = vi.fn();
    render(
      <SurfaceRenderer
        {...props}
        onSelectRow={onSelectRow}
        onInspectEvidence={onInspectEvidence}
      />,
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: "Inspect source 2 of 2 for Launch brief",
      }),
    );
    expect(onInspectEvidence).toHaveBeenCalledWith("evidence-b");
    expect(onSelectRow).not.toHaveBeenCalled();
    expect(screen.getByText("No sources attached")).toBeTruthy();
    expect(screen.getByText("Not provided")).toBeTruthy();
  });

  it("filters available values without claiming completeness or clearing controlled selections", () => {
    const { rerender } = render(
      <SurfaceRenderer {...props} filter=" avery " />,
    );
    expect(screen.getByText("Partial collection")).toBeTruthy();
    expect(
      screen.getByText("2 of 4 records available · More records may exist"),
    ).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe(
      "Showing 1 of 2 available records",
    );
    expect(
      screen.queryByRole("checkbox", { name: "Select Schedule" }),
    ).toBeNull();
    rerender(<SurfaceRenderer {...props} filter="unmatched" />);
    expect(screen.getByText("No matching records")).toBeTruthy();
    expect(screen.queryByRole("table")).toBeNull();
    rerender(<SurfaceRenderer {...props} filter="" />);
    expect(
      (
        screen.getByRole("checkbox", {
          name: "Select Launch brief",
        }) as HTMLInputElement
      ).checked,
    ).toBe(true);
  });

  it("distinguishes an empty partial source from a complete empty collection", () => {
    const empty = { ...collection, rows: [], totalCount: undefined };
    const { rerender } = render(
      <SurfaceRenderer
        {...props}
        surface={{ ...surface, components: [empty] }}
      />,
    );
    expect(
      screen.getByText(
        "This is a partial collection. An empty result does not mean no records exist.",
      ),
    ).toBeTruthy();
    rerender(
      <SurfaceRenderer
        {...props}
        surface={{ ...surface, components: [{ ...empty, complete: true }] }}
      />,
    );
    expect(screen.getByText("Complete collection")).toBeTruthy();
    expect(
      screen.getByText("This collection does not contain any records."),
    ).toBeTruthy();
  });

  it("renders summaries as inert text and checklist state through words rather than color alone", () => {
    const text = '<img src="x" onerror="alert(1)">';
    render(
      <SurfaceRenderer
        {...props}
        surface={{
          ...surface,
          components: [
            {
              type: "summary",
              id: "summary",
              title: "Overview",
              text,
              evidenceIds: [],
            },
            {
              type: "checklist",
              id: "checks",
              title: "Readiness",
              items: [
                { id: "a", label: "Brief", status: "ready", evidenceIds: [] },
                {
                  id: "b",
                  label: "Rights",
                  status: "needs-review",
                  evidenceIds: [],
                },
                {
                  id: "c",
                  label: "Artwork",
                  status: "missing",
                  evidenceIds: [],
                },
              ],
            },
          ],
        }}
      />,
    );
    expect(screen.getByText(text)).toBeTruthy();
    expect(screen.queryByRole("img")).toBeNull();
    const checklist = screen.getByRole("region", { name: "Readiness" });
    for (const label of ["Ready", "Needs review", "Missing"])
      expect(within(checklist).getByText(label)).toBeTruthy();
  });

  it("provides an understandable text fallback when a surface has no components", () => {
    render(
      <SurfaceRenderer {...props} surface={{ ...surface, components: [] }} />,
    );
    expect(screen.getByText(surface.fallbackText)).toBeTruthy();
  });
});
