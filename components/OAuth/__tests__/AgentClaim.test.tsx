// @vitest-environment jsdom
import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import AgentClaim from "../AgentClaim";

const { auth, load, decide } = vi.hoisted(() => ({
  auth: {
    ready: true,
    authenticated: true,
    user: { id: "alice", email: { address: "alice@example.com" } },
    login: vi.fn(),
    logout: vi.fn(),
    getAccessToken: vi.fn(async () => "session"),
  },
  load: vi.fn(),
  decide: vi.fn(),
}));
vi.mock("@privy-io/react-auth", () => ({ usePrivy: () => auth }));
vi.mock("@/lib/oauth/createAgentClaimClient", () => ({
  createAgentClaimClient: () => ({ load, decide }),
}));
const props = {
  issuer: "https://api.example/api/oauth",
  attempt: `cla_${"a".repeat(43)}`,
};
const metadata = {
  csrf: "nonce",
  expiresIn: 600,
  accessDurationSeconds: 3600,
  permissions: [
    {
      scope: "mcp:read",
      description: "Read your personal artists, social profiles, and chat list",
    },
  ],
};
beforeEach(() => {
  vi.clearAllMocks();
  auth.authenticated = true;
  auth.user.id = "alice";
  load.mockResolvedValue(metadata);
  decide.mockResolvedValue("approved");
});
afterEach(cleanup);

it("requires sign-in before loading the claim or showing consent controls", () => {
  auth.authenticated = false;
  render(<AgentClaim {...props} />);
  expect(
    screen.getByRole("button", { name: "Sign in to Recoup" }),
  ).toBeTruthy();
  expect(
    screen.queryByRole("button", { name: "Allow read access" }),
  ).toBeNull();
  expect(load).not.toHaveBeenCalled();
  expect(decide).not.toHaveBeenCalled();
});

it("requires the typed code and explicit action, and shows the scope and duration", async () => {
  render(<AgentClaim {...props} />);
  const code = await screen.findByLabelText("Code from your agent");
  expect((code as HTMLInputElement).value).toBe("");
  expect(screen.getByText(/One hour/)).toBeTruthy();
  expect(
    (
      screen.getByRole("button", {
        name: "Allow read access",
      }) as HTMLButtonElement
    ).disabled,
  ).toBe(true);
  fireEvent.change(code, { target: { value: "123456" } });
  expect(decide).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Allow read access" }));
  await screen.findByText("Read access connected");
  expect(decide).toHaveBeenCalledWith("session", "nonce", "approve", "123456");
  expect(
    screen
      .getByRole("link", { name: "Manage connected agents" })
      .getAttribute("href"),
  ).toBe("/oauth/connections");
});

it("allows denial without entering a code", async () => {
  render(<AgentClaim {...props} />);
  fireEvent.click(await screen.findByRole("button", { name: "Decline" }));
  await screen.findByText("Connection declined");
  expect(decide).toHaveBeenCalledWith("session", "nonce", "deny", undefined);
});

it.each(["account", "attempt"])(
  "hides old consent immediately when the %s changes",
  async (change) => {
    const view = render(<AgentClaim {...props} />);
    await screen.findByLabelText("Code from your agent");
    load.mockImplementation(() => new Promise(() => {}));
    if (change === "account") auth.user.id = "bob";
    view.rerender(
      <AgentClaim
        {...props}
        attempt={change === "attempt" ? `cla_${"c".repeat(43)}` : props.attempt}
      />,
    );
    expect(
      screen.queryByRole("button", { name: "Allow read access" }),
    ).toBeNull();
    await waitFor(() => expect(load).toHaveBeenCalledTimes(2));
  },
);

it("reloads a fresh approval ticket after an incorrect code without claiming success", async () => {
  decide.mockRejectedValueOnce(new Error("That code did not match."));
  load
    .mockResolvedValueOnce(metadata)
    .mockResolvedValue({ ...metadata, csrf: "fresh-nonce" });
  render(<AgentClaim {...props} />);
  fireEvent.change(await screen.findByLabelText("Code from your agent"), {
    target: { value: "111111" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Allow read access" }));
  await screen.findByRole("alert");
  await waitFor(() => expect(load).toHaveBeenCalledTimes(2));
  expect(screen.queryByText("Read access connected")).toBeNull();
  fireEvent.change(await screen.findByLabelText("Code from your agent"), {
    target: { value: "123456" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Allow read access" }));
  await screen.findByText("Read access connected");
  expect(decide).toHaveBeenNthCalledWith(
    2,
    "session",
    "fresh-nonce",
    "approve",
    "123456",
  );
});
