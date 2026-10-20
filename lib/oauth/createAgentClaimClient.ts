import { z } from "zod";

import {
  agentClaimErrorMessages,
  metadataSchema,
  errorSchema,
  unverifiedMessage,
  type AgentClaimMetadata,
} from "./agentClaimSchemas";
export type { AgentClaimMetadata } from "./agentClaimSchemas";

/** Keep sign-in credentials on the configured issuer and reject a widened consent policy. */
export function createAgentClaimClient(issuer: string, attempt: string) {
  const base = new URL(issuer);
  if (
    (base.protocol !== "https:" &&
      !(base.protocol === "http:" && base.hostname === "127.0.0.1")) ||
    base.username ||
    base.password ||
    base.search ||
    base.hash ||
    base.pathname !== "/api/oauth" ||
    base.href !== issuer ||
    !/^cla_[A-Za-z0-9_-]{43}$/.test(attempt)
  )
    throw new Error("Invalid connection request.");

  const request = async (
    path: string,
    token: string,
    body: Record<string, unknown>,
    signal?: AbortSignal,
  ): Promise<unknown> => {
    const response = await fetch(`${issuer}/agent/identity/claim${path}`, {
      method: "POST",
      credentials: "omit",
      cache: "no-store",
      redirect: "error",
      signal,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        claim_attempt_token: attempt,
        ...body,
      }),
    });
    const data: unknown = await response.json().catch(() => undefined);
    if (!response.ok) {
      const error = errorSchema.safeParse(data);
      throw new Error(
        error.success
          ? agentClaimErrorMessages[error.data.error]
          : unverifiedMessage,
      );
    }
    return data;
  };
  return {
    async load(
      token: string,
      signal?: AbortSignal,
    ): Promise<AgentClaimMetadata> {
      const result = metadataSchema.safeParse(
        await request("", token, {}, signal),
      );
      if (!result.success) throw new Error(unverifiedMessage);
      return result.data;
    },
    async decide(
      token: string,
      csrf: string,
      decision: "approve" | "deny",
      code?: string,
    ) {
      if (decision === "approve" && !/^\d{6}$/.test(code ?? ""))
        throw new Error("Enter the six-digit code shown by your agent.");
      const result = z
        .object({ status: z.enum(["approved", "denied"]) })
        .safeParse(
          await request("/complete", token, {
            csrf,
            decision,
            ...(decision === "approve" ? { user_code: code } : {}),
          }),
        );
      if (!result.success) throw new Error(unverifiedMessage);
      if (
        result.data.status !== (decision === "approve" ? "approved" : "denied")
      )
        throw new Error(
          "Unable to confirm the connection. Check Connected agents.",
        );
      return result.data.status;
    },
  };
}
