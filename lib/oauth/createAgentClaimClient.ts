import { z } from "zod";

const metadataSchema = z.object({
  csrf: z.string().regex(/^[A-Za-z0-9_-]{43}$/),
  accountId: z.string().uuid(),
  context: z.literal("personal"),
  clientName: z.string(),
  expiresIn: z.number().positive().max(600),
  accessDurationSeconds: z.literal(3600),
  permissions: z.tuple([
    z.object({ scope: z.literal("mcp:read"), description: z.string() }),
  ]),
});
export type AgentClaimMetadata = z.infer<typeof metadataSchema>;
const unverifiedMessage =
  "This request expired or could not be verified. Start a new connection in your agent.";
const errorSchema = z.object({
  error: z.enum([
    "account_mismatch",
    "login_required",
    "invalid_user_code",
    "temporarily_unavailable",
  ]),
});

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
      const messages: Record<string, string> = {
        account_mismatch:
          "Sign in with the verified email used to start this connection.",
        login_required: "Sign in again to review this connection.",
        invalid_user_code:
          "That code did not match. Check the code shown by your agent and try again.",
        temporarily_unavailable:
          "Recoup could not verify this request. Try again shortly.",
      };
      throw new Error(
        error.success ? messages[error.data.error] : unverifiedMessage,
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
