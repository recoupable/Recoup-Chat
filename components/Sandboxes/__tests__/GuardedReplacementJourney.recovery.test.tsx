// @vitest-environment jsdom
import { vi, expect, it } from "vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  SandboxFileTree,
  uploadSandboxFiles,
  SandboxFileConflictError,
  fixture,
} from "./guardedJourney.fixture";

it.each(["loading", "error", "empty"])(
  "keeps recovery controls visible when file listing becomes %s",
  async (state) => {
    vi.mocked(uploadSandboxFiles).mockRejectedValue(
      new SandboxFileConflictError(),
    );
    const view = render(<SandboxFileTree />);
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Drop replacement" }));
    await waitFor(() => expect(screen.getByRole("alert")).toBeTruthy());
    if (state === "loading") fixture.loading = true;
    if (state === "error")
      fixture.listingError = new Error("Synthetic listing failure");
    if (state === "empty") fixture.empty = true;
    view.rerender(<SandboxFileTree />);
    expect(
      (screen.getByRole("button", { name: "Keep a copy" }) as HTMLButtonElement)
        .disabled,
    ).toBe(false);
    expect(
      screen.getByRole("button", { name: "Discard replacement" }),
    ).toBeTruthy();
  },
);

it("never falls back to a legacy drop across an account switch with retained work", async () => {
  vi.mocked(uploadSandboxFiles).mockRejectedValue(
    new SandboxFileConflictError(),
  );
  const view = render(<SandboxFileTree />);
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(screen.getByRole("button", { name: "Drop replacement" }));
  await waitFor(() => expect(screen.getByRole("alert")).toBeTruthy());
  fixture.actor = "actor-b";
  view.rerender(<SandboxFileTree />);
  expect((screen.getByRole("checkbox") as HTMLInputElement).disabled).toBe(
    true,
  );
  fireEvent.click(screen.getByRole("checkbox"));
  fixture.actor = "actor-a";
  view.rerender(<SandboxFileTree />);
  fireEvent.click(screen.getByRole("button", { name: "Drop replacement" }));
  expect(fixture.legacy).not.toHaveBeenCalled();
  expect(uploadSandboxFiles).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("button", { name: "Keep a copy" })).toBeTruthy();
});
