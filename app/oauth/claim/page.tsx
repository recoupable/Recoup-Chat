import { notFound } from "next/navigation";
import AgentClaim from "@/components/OAuth/AgentClaim";
import { createAgentClaimClient } from "@/lib/oauth/createAgentClaimClient";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Connect an agent | Recoup",
  robots: { index: false, follow: false },
  referrer: "no-referrer" as const,
};

export default async function AgentClaimPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (
    process.env.OAUTH_AGENT_REGISTRATION_ENABLED !== "true" ||
    process.env.OAUTH_CONSENT_ENABLED !== "true" ||
    !process.env.OAUTH_ISSUER
  )
    notFound();
  const { claim_attempt_token: attempt } = await searchParams;
  if (typeof attempt !== "string") notFound();
  try {
    createAgentClaimClient(process.env.OAUTH_ISSUER, attempt);
  } catch {
    notFound();
  }
  return (
    <AgentClaim
      key={`${process.env.OAUTH_ISSUER}:${attempt}`}
      issuer={process.env.OAUTH_ISSUER}
      attempt={attempt}
    />
  );
}
