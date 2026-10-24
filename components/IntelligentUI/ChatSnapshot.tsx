"use client";

import { useState } from "react";
import type { Surface } from "@/lib/intelligent-ui/schema";
import AnswerRenderer from "./AnswerRenderer";
import EvidenceDialog from "./EvidenceDialog";

/** An inline response fragment, with no page/application chrome or provider actions. */
export default function ChatSnapshot({
  surface,
  scopeKey,
  messageId,
}: {
  surface: Surface;
  scopeKey: string;
  messageId: string;
}) {
  const [evidenceId, setEvidenceId] = useState<string | null>(null);
  const [returnFocus, setReturnFocus] = useState<HTMLElement | null>(null);
  return (
    <>
      <AnswerRenderer
        surface={surface}
        stateScope={JSON.stringify([scopeKey, messageId, surface.id])}
        onInspectEvidence={(id, element) => {
          setReturnFocus(element);
          setEvidenceId(id);
        }}
      />
      <EvidenceDialog
        evidence={
          surface.evidence.find((entry) => entry.id === evidenceId) ?? null
        }
        onClose={() => setEvidenceId(null)}
        returnFocus={returnFocus}
      />
    </>
  );
}
