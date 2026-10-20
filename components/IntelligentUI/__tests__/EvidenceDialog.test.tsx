// @vitest-environment jsdom
import { useState } from "react";
import { afterEach, describe, expect, it } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import type { Evidence } from "@/lib/intelligent-ui/schema";
import EvidenceDialog from "../EvidenceDialog";

afterEach(cleanup);

const evidence: Evidence = {
  id: "focus-example",
  label: "Synthetic focus example",
  sourceLabel: "Authored conformance fixture",
  observedAt: "2026-10-16T12:00:00Z",
  kind: "submitted",
  status: "current",
  text: "Synthetic source text for focus conformance.",
};

function Harness({ href }: { href?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Inspect source</button>
      <EvidenceDialog
        evidence={open ? { ...evidence, href } : null}
        returnFocus={null}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

describe("EvidenceDialog", () => {
  it.each([undefined, "https://example.com/source"])(
    "contains initial reading focus before any control is visited, with link %s",
    async (href) => {
      render(<Harness href={href} />);
      const trigger = screen.getByRole("button", { name: "Inspect source" });
      trigger.focus();
      fireEvent.click(trigger);
      const heading = await screen.findByRole("heading", {
        name: evidence.label,
      });
      await waitFor(() => expect(document.activeElement).toBe(heading));
      trigger.focus();
      expect(document.activeElement).toBe(heading);
    },
  );
});
