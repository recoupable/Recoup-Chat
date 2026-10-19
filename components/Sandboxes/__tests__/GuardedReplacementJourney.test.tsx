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
  file,
  opened,
} from "./guardedJourney.fixture";

it("leaves the existing upload journey unchanged while the gate is off", () => {
  fixture.enabled = false;
  render(<SandboxFileTree />);
  expect(screen.queryByRole("checkbox")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Drop replacement" }));
  expect(fixture.legacy).toHaveBeenCalledWith([file]);
  expect(uploadSandboxFiles).not.toHaveBeenCalled();
});

it("keeps the actual replacement after conflict and viewing latest never retries it", async () => {
  vi.mocked(uploadSandboxFiles).mockRejectedValue(
    new SandboxFileConflictError(),
  );
  render(<SandboxFileTree />);
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(screen.getByRole("button", { name: "Drop replacement" }));
  await waitFor(() =>
    expect(screen.getByRole("alert").textContent).toContain("changed"),
  );
  expect((screen.getByRole("checkbox") as HTMLInputElement).disabled).toBe(
    true,
  );
  expect(screen.getByText(/Your replacement, draft.txt, is kept/)).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "View latest file" }));
  expect(fixture.reopen).toHaveBeenCalledWith(opened.path);
  expect(uploadSandboxFiles).toHaveBeenCalledTimes(1);
  expect(uploadSandboxFiles).toHaveBeenCalledWith(
    expect.objectContaining({
      path: "notes",
      files: [file],
      guard: expect.objectContaining({ opened }),
    }),
  );
  expect(fixture.legacy).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Discard replacement" }));
  expect(screen.queryByRole("alert")).toBeNull();
});
