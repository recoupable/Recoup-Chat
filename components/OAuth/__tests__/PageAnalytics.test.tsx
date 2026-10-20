// @vitest-environment jsdom
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import PageAnalytics from "@/components/Analytics/PageAnalytics";

const route = vi.hoisted(() => ({
  pathname: "/oauth/claim",
  filter: undefined as
    | undefined
    | ((event: { type: "pageview"; url: string }) => unknown),
}));
vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));
vi.mock("@vercel/analytics/next", () => ({
  Analytics: (props: { beforeSend?: typeof route.filter }) => {
    route.filter = props.beforeSend;
    return <span>analytics enabled</span>;
  },
}));
afterEach(cleanup);
it("keeps consent handles and claim URLs out of page analytics", () => {
  for (const pathname of [
    "/oauth/claim",
    "/oauth/authorize",
    "/oauth/connections",
  ]) {
    route.pathname = pathname;
    render(<PageAnalytics />);
    expect(screen.queryByText("analytics enabled")).toBeNull();
    cleanup();
  }
  route.pathname = "/chat";
  render(<PageAnalytics />);
  expect(screen.getByText("analytics enabled")).toBeTruthy();
  expect(
    route.filter?.({
      type: "pageview",
      url: "https://chat.example/oauth/claim?claim_attempt_token=secret",
    }),
  ).toBeNull();
  expect(
    route.filter?.({ type: "pageview", url: "https://chat.example/chat" }),
  ).toMatchObject({ url: "https://chat.example/chat" });
});
