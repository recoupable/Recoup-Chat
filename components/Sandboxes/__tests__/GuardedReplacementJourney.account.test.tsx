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

it("shows A's retained recovery after B rejects a drop and A returns", async () => {
  vi.mocked(uploadSandboxFiles).mockRejectedValue(
    new SandboxFileConflictError(),
  );
  const view = render(<SandboxFileTree />);
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(screen.getByRole("button", { name: "Drop replacement" }));
  await waitFor(() => expect(screen.getByRole("alert")).toBeTruthy());
  fixture.actor = "actor-b";
  view.rerender(<SandboxFileTree />);
  fireEvent.click(screen.getByRole("button", { name: "Drop replacement" }));
  expect(screen.getByRole("alert").textContent).toContain(
    "Return to the original account",
  );
  expect(screen.queryByRole("button", { name: "Keep a copy" })).toBeNull();
  fixture.actor = "actor-a";
  view.rerender(<SandboxFileTree />);
  expect(screen.getByRole("button", { name: "Keep a copy" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "View latest file" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Discard replacement" }));
  expect(screen.queryByRole("button", { name: "Keep a copy" })).toBeNull();
  expect(uploadSandboxFiles).toHaveBeenCalledTimes(1);
  expect(fixture.legacy).not.toHaveBeenCalled();
});
