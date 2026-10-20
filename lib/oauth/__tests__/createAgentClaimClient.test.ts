import { afterEach, expect, it, vi } from "vitest";
import { createAgentClaimClient } from "../createAgentClaimClient";

const issuer = "https://api.example/api/oauth";
const attempt = `cla_${"a".repeat(43)}`;
const metadata = {
  csrf: "b".repeat(43),
  accountId: "00000000-0000-4000-8000-000000000001",
  context: "personal",
  clientName: "Agent registration (read only)",
  expiresIn: 600,
  accessDurationSeconds: 3600,
  permissions: [{ scope: "mcp:read", description: "Read personal profiles" }],
};
afterEach(() => vi.unstubAllGlobals());

it("sends the session only to the configured issuer and requires the fixed personal read policy", async () => {
  const request = vi
    .fn()
    .mockResolvedValue(new Response(JSON.stringify(metadata)));
  vi.stubGlobal("fetch", request);
  const client = createAgentClaimClient(issuer, attempt);
  expect(await client.load("session")).toEqual(metadata);
  expect(request).toHaveBeenCalledWith(
    `${issuer}/agent/identity/claim`,
    expect.objectContaining({
      method: "POST",
      redirect: "error",
      credentials: "omit",
      cache: "no-store",
      headers: {
        Authorization: "Bearer session",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ claim_attempt_token: attempt }),
    }),
  );
  for (const invalid of [
    { ...metadata, context: "organization" },
    { ...metadata, accessDurationSeconds: null },
    {
      ...metadata,
      permissions: [{ scope: "mcp:tools", description: "Everything" }],
    },
  ]) {
    request.mockResolvedValue(new Response(JSON.stringify(invalid)));
    await expect(client.load("session")).rejects.toThrow();
  }
});

it("submits only an explicit decision, typed code, and one-use approval ticket", async () => {
  const request = vi
    .fn()
    .mockResolvedValue(new Response('{"status":"approved"}'));
  vi.stubGlobal("fetch", request);
  const client = createAgentClaimClient(issuer, attempt);
  expect(
    await client.decide("session", metadata.csrf, "approve", "123456"),
  ).toBe("approved");
  expect(JSON.parse(request.mock.calls[0][1].body)).toEqual({
    claim_attempt_token: attempt,
    csrf: metadata.csrf,
    decision: "approve",
    user_code: "123456",
  });
  await expect(
    client.decide("session", metadata.csrf, "approve", "123"),
  ).rejects.toThrow();
});

it("rejects unsafe issuer and handle input before making any credentialed request", () => {
  for (const unsafe of [
    "http://api.example/api/oauth",
    "https://user:pass@api.example/api/oauth",
    `${issuer}?evil=1`,
    "https://api.example/api/other",
  ])
    expect(() => createAgentClaimClient(unsafe, attempt)).toThrow();
  expect(() =>
    createAgentClaimClient(issuer, `${attempt}&code=123456`),
  ).toThrow();
});

it("returns useful errors without exposing server diagnostics", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      new Response('{"error":"account_mismatch","debug":"secret"}', {
        status: 403,
      }),
    ),
  );
  await expect(
    createAgentClaimClient(issuer, attempt).load("session"),
  ).rejects.toThrow("verified email");
});

it("uses a readable error for invalid policies, response JSON, and error bodies", async () => {
  const request = vi.fn();
  vi.stubGlobal("fetch", request);
  const client = createAgentClaimClient(issuer, attempt);
  const message =
    "This request expired or could not be verified. Start a new connection in your agent.";
  for (const response of [
    new Response(JSON.stringify({ ...metadata, accessDurationSeconds: 7200 })),
    new Response("<html>proxy error</html>"),
    new Response("null", { status: 400 }),
    new Response('{"error":"unrecognized","debug":"secret"}', { status: 400 }),
    new Response('{"error":"constructor"}', { status: 400 }),
  ]) {
    request.mockResolvedValue(response);
    await expect(client.load("session")).rejects.toHaveProperty(
      "message",
      message,
    );
  }
  request.mockResolvedValue(new Response('{"status":"unknown"}'));
  await expect(
    client.decide("session", metadata.csrf, "approve", "123456"),
  ).rejects.toHaveProperty("message", message);
});
