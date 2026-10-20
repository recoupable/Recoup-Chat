"use client";

import { Check } from "lucide-react";
import LogoIcon from "@/components/Logo/LogoIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAgentClaim } from "./useAgentClaim";

export default function AgentClaim({
  issuer,
  attempt,
}: {
  issuer: string;
  attempt: string;
}) {
  const {
    ready,
    authenticated,
    user,
    login,
    code,
    setCode,
    error,
    busy,
    done,
    metadata,
    decide,
    switchAccount,
  } = useAgentClaim(issuer, attempt);

  return (
    <section
      aria-labelledby="claim-title"
      className="mx-auto w-full max-w-md px-5 pb-10 pt-6 sm:pt-10"
    >
      <div className="overflow-hidden rounded-3xl bg-card shadow-[0_0_0_1px_var(--border),0_12px_40px_var(--surface-shadow)]">
        <header className="bg-brand-on-lime px-6 py-6 text-white sm:px-7">
          <LogoIcon
            className="mb-5 size-7 text-brand-lime"
            aria-hidden="true"
          />
          <h1
            id="claim-title"
            className="font-heading text-3xl font-medium leading-tight tracking-tight"
          >
            Connect your agent
            <br />
            to <span className="text-brand-lime">Recoup.</span>
          </h1>
          {authenticated && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-white/75">
              <span className="break-all">
                {user?.email?.address ?? "Signed in to Recoup"}
              </span>
              <button
                type="button"
                disabled={busy}
                onClick={() => void switchAccount()}
                className="min-h-11 rounded-md px-1 underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-brand-lime disabled:opacity-50"
              >
                Switch account
              </button>
            </div>
          )}
        </header>
        <div className="space-y-5 p-6 sm:p-7">
          {!ready ? (
            <p role="status">Loading sign-in…</p>
          ) : !authenticated ? (
            <>
              <p className="text-sm text-muted-foreground">
                Sign in with the email you gave your agent to review this
                connection.
              </p>
              <Button onClick={() => login()} className="w-full">
                Sign in to Recoup
              </Button>
            </>
          ) : done ? (
            <div role="status" className="space-y-3">
              <h2 className="text-lg font-medium">
                {done === "approve"
                  ? "Read access connected"
                  : "Connection declined"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {done === "approve"
                  ? "Your agent can read your personal profiles and chat list for one hour. Return to your agent to continue."
                  : "This request grants no access. You can close this page."}
              </p>
              {done === "approve" && (
                <a
                  href="/oauth/connections"
                  className="inline-flex min-h-11 items-center text-sm text-brand-link underline underline-offset-4"
                >
                  Manage connected agents
                </a>
              )}
            </div>
          ) : metadata ? (
            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                void decide("approve");
              }}
            >
              <div className="flex items-start gap-3 text-sm leading-5">
                <Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <p>
                  Read your personal artists, social profiles, and chat list
                </p>
              </div>
              <p className="text-xs leading-5 text-muted-foreground">
                Personal account · One hour · Revoke anytime
                <br />
                Your organization workspaces and write actions are not included.
              </p>
              <div className="space-y-2">
                <label htmlFor="agent-code" className="text-sm font-medium">
                  Code from your agent
                </label>
                <Input
                  id="agent-code"
                  name="code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={code}
                  required
                  disabled={busy}
                  onChange={(event) =>
                    setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  aria-describedby="agent-code-help"
                  className="h-12 font-mono text-lg tracking-[0.3em]"
                />
                <p
                  id="agent-code-help"
                  className="text-xs leading-5 text-muted-foreground"
                >
                  Enter the six-digit code shown by the agent you want to
                  connect. Only approve a connection you started.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={busy}
                  onClick={() => void decide("deny")}
                  className="h-11 flex-1"
                >
                  Decline
                </Button>
                <Button
                  type="submit"
                  aria-busy={busy}
                  disabled={busy || !/^\d{6}$/.test(code)}
                  className="h-11 flex-[2] rounded-xl"
                >
                  {busy ? "Verifying…" : "Allow read access"}
                </Button>
              </div>
            </form>
          ) : (
            !error && <p role="status">Loading connection request…</p>
          )}
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
