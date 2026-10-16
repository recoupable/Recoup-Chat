// @vitest-environment jsdom
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import FollowUpDraft from "../FollowUpDraft";

const writeText = vi.fn();
const originalClipboard = Object.getOwnPropertyDescriptor(
  navigator,
  "clipboard",
);

beforeEach(() => {
  writeText.mockReset();
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
});

afterEach(() => {
  cleanup();
  if (originalClipboard)
    Object.defineProperty(navigator, "clipboard", originalClipboard);
  else Reflect.deleteProperty(navigator, "clipboard");
});

function DraftHarness() {
  const [value, setValue] = useState("First line.\nSecond line.");
  return (
    <FollowUpDraft
      value={value}
      onChange={setValue}
      onClose={vi.fn()}
      saved
      restored
    />
  );
}

describe("FollowUpDraft", () => {
  it("copies the exact edited draft and clears the success state on further edits", async () => {
    writeText.mockResolvedValue(undefined);
    render(<DraftHarness />);
    const editor = screen.getByRole("textbox", { name: "Follow-up draft" });
    fireEvent.change(editor, {
      target: { value: "Edited line.\nKeep this spacing." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Copy draft" }));
    await screen.findByRole("button", { name: "Copied" });
    expect(writeText).toHaveBeenCalledWith("Edited line.\nKeep this spacing.");
    expect(screen.getByRole("status").textContent).toBe("Draft copied.");
    fireEvent.change(editor, { target: { value: "A newer draft" } });
    expect(screen.getByRole("button", { name: "Copy draft" })).toBeTruthy();
  });

  it("selects the full draft for manual copying when clipboard access fails", async () => {
    writeText.mockRejectedValue(new Error("Clipboard unavailable"));
    render(<DraftHarness />);
    const editor = screen.getByRole("textbox", {
      name: "Follow-up draft",
    }) as HTMLTextAreaElement;
    fireEvent.click(screen.getByRole("button", { name: "Copy draft" }));
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toContain(
        "The draft is selected",
      ),
    );
    expect(document.activeElement).toBe(editor);
    expect(editor.selectionStart).toBe(0);
    expect(editor.selectionEnd).toBe(editor.value.length);
    expect(editor.value).toBe("First line.\nSecond line.");
  });

  it("keeps editing unavailable until restoration and disables copying whitespace-only drafts", () => {
    render(
      <FollowUpDraft
        value={" \n "}
        onChange={vi.fn()}
        onClose={vi.fn()}
        saved={false}
        restored={false}
      />,
    );
    expect(
      (
        screen.getByRole("textbox", {
          name: "Follow-up draft",
        }) as HTMLTextAreaElement
      ).disabled,
    ).toBe(true);
    expect(
      (screen.getByRole("button", { name: "Copy draft" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    expect(screen.getByText("Kept in this tab. Nothing sent.")).toBeTruthy();
  });

  it("does not report a newer edited draft as copied when an older copy operation resolves", async () => {
    let resolveCopy!: () => void;
    writeText.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveCopy = resolve;
      }),
    );
    render(<DraftHarness />);
    fireEvent.click(screen.getByRole("button", { name: "Copy draft" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Follow-up draft" }), {
      target: { value: "Newer uncopied text" },
    });
    await act(async () => resolveCopy());
    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith("First line.\nSecond line."),
    );
    expect(screen.queryByRole("button", { name: "Copied" })).toBeNull();
    expect(screen.getByRole("button", { name: "Copy draft" })).toBeTruthy();
  });

  it("does not steal focus or select newer text when an outdated copy attempt fails", async () => {
    let rejectCopy!: (error: Error) => void;
    writeText.mockReturnValue(
      new Promise<void>((_, reject) => {
        rejectCopy = reject;
      }),
    );
    render(
      <>
        <DraftHarness />
        <button type="button">Continue reviewing</button>
      </>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Copy draft" }));
    const editor = screen.getByRole("textbox", {
      name: "Follow-up draft",
    }) as HTMLTextAreaElement;
    fireEvent.change(editor, { target: { value: "Newer uncopied text" } });
    const nextControl = screen.getByRole("button", {
      name: "Continue reviewing",
    });
    nextControl.focus();
    await act(async () => rejectCopy(new Error("Clipboard unavailable")));
    expect(document.activeElement).toBe(nextControl);
    expect(screen.getByRole("status").textContent).not.toContain(
      "The draft is selected",
    );
    expect(editor.value).toBe("Newer uncopied text");
  });
});
