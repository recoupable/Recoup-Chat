"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import {
  createAgentClaimClient,
  type AgentClaimMetadata,
} from "@/lib/oauth/createAgentClaimClient";

/** Bind asynchronous consent state to the active account, issuer, and claim attempt. */
export function useAgentClaim(issuer: string, attempt: string) {
  const { ready, authenticated, user, login, logout, getAccessToken } =
    usePrivy();
  const client = useMemo(
    () => createAgentClaimClient(issuer, attempt),
    [issuer, attempt],
  );
  const [loaded, setLoaded] = useState<{
    userId: string;
    issuer: string;
    attempt: string;
    metadata: AgentClaimMetadata;
  }>();
  const [entered, setEntered] = useState<{
    value: string;
    account: string | undefined;
    issuer: string;
    attempt: string;
  }>();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [completed, setCompleted] = useState<{
    userId: string;
    issuer: string;
    attempt: string;
    decision: "approve" | "deny";
  }>();
  const submitting = useRef(false);
  const account = user?.id;
  const code =
    entered?.account === account &&
    entered?.issuer === issuer &&
    entered?.attempt === attempt
      ? entered.value
      : "";
  const setCode = (value: string) =>
    setEntered({ value, account, issuer, attempt });
  const metadata =
    authenticated &&
    loaded?.userId === account &&
    loaded?.issuer === issuer &&
    loaded?.attempt === attempt
      ? loaded.metadata
      : undefined;
  const done =
    completed?.userId === account &&
    completed?.issuer === issuer &&
    completed?.attempt === attempt
      ? completed.decision
      : undefined;

  useEffect(() => {
    if (!ready || !authenticated || !account) return;
    const abort = new AbortController();
    void (async () => {
      try {
        setError("");
        const token = await getAccessToken();
        if (!token) throw new Error("Sign in again to review this connection.");
        const details = await client.load(token, abort.signal);
        if (!abort.signal.aborted)
          setLoaded({ userId: account, issuer, attempt, metadata: details });
      } catch (cause) {
        if (!abort.signal.aborted)
          setError(
            cause instanceof Error
              ? cause.message
              : "Unable to load this request.",
          );
      }
    })();
    return () => abort.abort();
  }, [ready, authenticated, account, issuer, attempt, client, getAccessToken]);

  const decide = async (decision: "approve" | "deny") => {
    if (!metadata || !account || submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setError("");
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Sign in again to review this connection.");
      await client.decide(
        token,
        metadata.csrf,
        decision,
        decision === "approve" ? code : undefined,
      );
      setCompleted({ userId: account, issuer, attempt, decision });
      setLoaded(undefined);
      setCode("");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to finish this connection.",
      );
      setLoaded(undefined);
      setCode("");
      // A failed submission may have consumed its ticket. Reload before another attempt.
      try {
        const token = await getAccessToken();
        if (token)
          setLoaded({
            userId: account,
            issuer,
            attempt,
            metadata: await client.load(token),
          });
      } catch {
        // Preserve the useful error; expired or locked claims require a new request.
      }
    } finally {
      setBusy(false);
      submitting.current = false;
    }
  };

  const switchAccount = async () => {
    setLoaded(undefined);
    setCompleted(undefined);
    setCode("");
    setError("");
    await logout();
  };
  return {
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
  };
}
