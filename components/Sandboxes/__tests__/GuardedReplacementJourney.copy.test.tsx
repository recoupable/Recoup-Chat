// @vitest-environment jsdom
import { vi, expect, it } from "vitest";
import {
  fireEvent,
  render,
  screen,
  GuardedFileReplacementNotice,
  file,
  opened,
} from "./guardedJourney.fixture";

it("keeps a downloadable copy of the exact selected replacement", () => {
  const OriginalURL = URL;
  const create = vi.fn(() => "blob:synthetic-local-copy");
  const revoke = vi.fn();
  vi.stubGlobal(
    "URL",
    class extends OriginalURL {
      static createObjectURL = create;
      static revokeObjectURL = revoke;
    },
  );
  const click = vi
    .spyOn(HTMLAnchorElement.prototype, "click")
    .mockImplementation(() => {});
  vi.useFakeTimers();
  try {
    render(
      <GuardedFileReplacementNotice
        pending={{ file, opened }}
        error="File changed"
        disabled={false}
        onReopen={vi.fn()}
        onDiscard={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Keep a copy" }));
    expect(create).toHaveBeenCalledWith(file);
    expect(click).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1000);
    expect(revoke).toHaveBeenCalledWith("blob:synthetic-local-copy");
  } finally {
    vi.useRealTimers();
    vi.stubGlobal("URL", OriginalURL);
    click.mockRestore();
  }
});
