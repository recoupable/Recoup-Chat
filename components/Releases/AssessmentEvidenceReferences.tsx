import type { AssessmentInputManifest } from "@/lib/releases/assessmentTypes";

export default function AssessmentEvidenceReferences({
  documents,
}: {
  documents: AssessmentInputManifest["documents"];
}) {
  return (
    <ol className="space-y-3" aria-label="Evidence version references">
      {documents.map((doc) => (
        <li
          key={doc.documentId}
          className="rounded-lg bg-background p-3 shadow-[0_0_0_1px_var(--border)]"
        >
          <p className="mb-3 font-medium">{doc.topic.replaceAll("_", " ")}</p>
          <dl className="grid min-w-0 gap-2 text-xs sm:grid-cols-[8rem_minmax(0,1fr)]">
            <dt className="text-muted-foreground">Document ID</dt>
            <dd className="break-all font-mono">{doc.documentId}</dd>
            <dt className="text-muted-foreground">Document version</dt>
            <dd>{doc.version}</dd>
            <dt className="text-muted-foreground">Result ID</dt>
            <dd className="break-all font-mono">
              {doc.resultId ?? "Not recorded"}
            </dd>
            <dt className="text-muted-foreground">Subject ID</dt>
            <dd className="break-all font-mono">{doc.subjectId}</dd>
            <dt className="text-muted-foreground">Source-version IDs</dt>
            <dd>
              <ul className="space-y-1">
                {doc.sourceVersionIds.map((id) => (
                  <li key={id} className="break-all font-mono">
                    {id}
                  </li>
                ))}
              </ul>
              {!doc.sourceVersionIds.length && "Not recorded"}
            </dd>
          </dl>
        </li>
      ))}
    </ol>
  );
}
