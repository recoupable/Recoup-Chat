import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { page } from "vitest/browser";
import AgentClaim from "../../components/OAuth/AgentClaim";
import "../../app/globals.css";

const auth = vi.hoisted(() => ({
  ready: true,
  authenticated: true,
  user: { id: "synthetic-account", email: { address: "artist@example.com" } },
  login: vi.fn(),
  logout: vi.fn(),
  getAccessToken: async () => "synthetic-session",
}));
vi.mock("@privy-io/react-auth", () => ({ usePrivy: () => auth }));
vi.mock("@/lib/oauth/createAgentClaimClient", () => ({
  createAgentClaimClient: () => ({
    load: async () => ({
      csrf: "synthetic-nonce",
      context: "personal",
      expiresIn: 600,
      accessDurationSeconds: 3600,
      permissions: [
        { scope: "mcp:read", description: "Read personal profiles" },
      ],
    }),
    decide: vi.fn(),
  }),
}));
afterEach(cleanup);

it.each([
  [390, 844, "mobile"],
  [1280, 900, "desktop"],
] as const)(
  "keeps the consent form readable at %s by %s",
  async (width, height, name) => {
    await page.viewport(width, height);
    const font = new FontFace(
      "Recoup test DM Sans",
      "url(/app/fonts/DMSans-Latin.woff2)",
    );
    document.fonts.add(await font.load());
    document.documentElement.style.setProperty(
      "--font-dm-sans",
      '"Recoup test DM Sans"',
    );
    render(
      <AgentClaim
        issuer="https://api.example/api/oauth"
        attempt={`cla_${"a".repeat(43)}`}
      />,
    );
    const input = await screen.findByLabelText("Code from your agent");
    expect(input.getBoundingClientRect().width).toBeGreaterThan(200);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(width);
    await page.screenshot({ path: `__screenshots__/claim-${name}.png` });
  },
);
