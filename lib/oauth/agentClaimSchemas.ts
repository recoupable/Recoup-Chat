import { z } from "zod";

export const metadataSchema = z
  .object({
    csrf: z.string().regex(/^[A-Za-z0-9_-]{43}$/),
    accountId: z.string().uuid(),
    context: z.literal("personal"),
    clientName: z.string(),
    expiresIn: z.number().positive().max(600),
    accessDurationSeconds: z.literal(3600),
    permissions: z.tuple([
      z
        .object({ scope: z.literal("mcp:read"), description: z.string() })
        .strict(),
    ]),
  })
  .strict();
export type AgentClaimMetadata = z.infer<typeof metadataSchema>;
export const unverifiedMessage =
  "This request expired or could not be verified. Start a new connection in your agent.";
export const errorSchema = z.object({
  error: z.enum([
    "account_mismatch",
    "login_required",
    "invalid_user_code",
    "temporarily_unavailable",
  ]),
});

export const agentClaimErrorMessages: Record<string, string> = {
  account_mismatch:
    "Sign in with the verified email used to start this connection.",
  login_required: "Sign in again to review this connection.",
  invalid_user_code:
    "That code did not match. Check the code shown by your agent and try again.",
  temporarily_unavailable:
    "Recoup could not verify this request. Try again shortly.",
};
