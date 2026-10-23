// @vitest-environment jsdom
import React from "react";
import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { useChatTransport } from "../useChatTransport";
import {
  chatSnapshotPart,
  hostScope,
} from "@/lib/intelligent-ui/transport/__tests__/chatSnapshotFixture";

const access = vi.hoisted(() => ({
  getAccessToken: vi.fn(async () => "synthetic-token"),
}));
vi.mock("@privy-io/react-auth", () => ({ usePrivy: () => access }));
vi.mock("@/lib/api/getClientApiBaseUrl", () => ({
  getClientApiBaseUrl: () => "https://recoup.invalid",
}));

beforeEach(() => {
  vi.stubEnv("NODE_ENV", "development");
  vi.stubEnv("VERCEL_ENV", "development");
  vi.stubEnv("NEXT_PUBLIC_VERCEL_ENV", "development");
  vi.stubEnv("NEXT_PUBLIC_RECOUP_INTELLIGENT_UI_CHAT", "true");
});
afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

it("keeps transport stable while immediately invalidating old host scope and late history callbacks", () => {
  const { result, rerender, unmount } = renderHook(
    ({ scope }) =>
      useChatTransport({
        chatId: scope.chatId,
        sessionId: scope.sessionId,
        snapshotScope: scope,
      }),
    { initialProps: { scope: structuredClone(hostScope) } },
  );
  const initial = result.current;
  const binding = initial.intelligentUI!;
  const oldStream = binding.consumer.beginStream({ messageId: "assistant-1" });
  expect(oldStream(chatSnapshotPart(1))).toBeTruthy();
  rerender({ scope: { ...hostScope, accountId: "another-account" } });
  expect(result.current.transport).toBe(initial.transport);
  expect(result.current.intelligentUI!.scopeKey).not.toBe(binding.scopeKey);
  expect(oldStream(chatSnapshotPart(2))).toBeUndefined();
  binding.consumer.hydrate(
    [{ id: "assistant-1", role: "assistant", parts: [chatSnapshotPart(5)] }],
    binding.scopeKey,
  );
  const next = result.current.intelligentUI!;
  expect(
    next.consumer.getSnapshot(
      "assistant-1",
      "synthetic-summary",
      next.scopeKey,
    ),
  ).toBeUndefined();
  const nextStream = next.consumer.beginStream({ messageId: "assistant-1" });
  expect(nextStream(chatSnapshotPart(3))).toBeTruthy();
  unmount();
  expect(nextStream(chatSnapshotPart(4))).toBeUndefined();
});

it("supports StrictMode setup/cleanup without reviving disposed in-flight streams", () => {
  const { result, unmount } = renderHook(
    () =>
      useChatTransport({
        chatId: hostScope.chatId,
        sessionId: hostScope.sessionId,
        snapshotScope: hostScope,
      }),
    {
      wrapper: ({ children }) => (
        <React.StrictMode>{children}</React.StrictMode>
      ),
    },
  );
  const binding = result.current.intelligentUI!;
  const stream = binding.consumer.beginStream({ messageId: "assistant-1" });
  expect(stream(chatSnapshotPart(1))).toBeTruthy();
  expect(
    binding.consumer.getSnapshot(
      "assistant-1",
      "synthetic-summary",
      binding.scopeKey,
    )?.revision,
  ).toBe(1);
  unmount();
  expect(stream(chatSnapshotPart(2))).toBeUndefined();
});

it("does not expose a binding without an explicit complete host scope or when the gate is off", () => {
  const { result, rerender } = renderHook(
    ({ enabled, scope }) => {
      vi.stubEnv("NEXT_PUBLIC_RECOUP_INTELLIGENT_UI_CHAT", String(enabled));
      return useChatTransport({
        chatId: hostScope.chatId,
        sessionId: hostScope.sessionId,
        snapshotScope: scope,
      });
    },
    {
      initialProps: {
        enabled: true,
        scope: undefined as typeof hostScope | undefined,
      },
    },
  );
  expect(result.current.intelligentUI).toBeUndefined();
  rerender({ enabled: true, scope: { ...hostScope, actorId: "" } });
  expect(result.current.intelligentUI).toBeUndefined();
  rerender({ enabled: false, scope: hostScope });
  expect(result.current.intelligentUI).toBeUndefined();
});
