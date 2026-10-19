// @vitest-environment jsdom
import React from "react";
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from "@tanstack/react-query";
import { afterEach, beforeEach, vi } from "vitest";
import useSandboxFileContent from "../useSandboxFileContent";
import { getFileContents } from "@/lib/sandboxes/getFileContents";

const identity = { actor: "actor-a" };
const token = vi.fn(async () => "synthetic-token");
vi.mock("@privy-io/react-auth", () => ({
  usePrivy: () => ({ user: { id: identity.actor }, getAccessToken: token }),
}));
vi.mock("@/lib/api/getClientApiBaseUrl", () => ({
  getClientApiBaseUrl: () => "https://api-synthetic-recoup.vercel.app",
}));
vi.mock("@/lib/sandboxes/getFileContents", () => ({
  getFileContents: vi.fn(),
}));
let client: QueryClient;
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
);
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getFileContents).mockReset();
  identity.actor = "actor-a";
  token.mockResolvedValue("synthetic-token");
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
});
afterEach(() => {
  cleanup();
  client.clear();
  focusManager.setFocused(undefined);
});
export {
  act,
  renderHook,
  waitFor,
  getFileContents,
  useSandboxFileContent,
  identity,
  token,
  client,
  wrapper,
};
