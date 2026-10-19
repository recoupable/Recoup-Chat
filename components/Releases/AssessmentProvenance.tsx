import type {
  CompanyAssessmentBrief,
  CompanyAssessmentSnapshot,
} from "@/lib/releases/assessmentTypes";

interface Props {
  brief: CompanyAssessmentBrief;
  snapshot: CompanyAssessmentSnapshot | null;
}

/** Only displays references returned with this brief, never the current selection's IDs. */
export default function AssessmentProvenance({ brief, snapshot }: Props) {
  const manifest = brief.input_manifest;
  return (
    <details className="rounded-xl bg-muted/30 p-4 text-sm">
      <summary className="cursor-pointer font-medium">
        Snapshot and source details
      </summary>
      <div className="mt-4 min-w-0 space-y-4">
        <p className="text-xs text-muted-foreground">
          Use these exact references to compare this assessment in another app.
          Saved evidence may include unverified assertions.
        </p>
        <dl className="grid min-w-0 gap-2 text-xs sm:grid-cols-[8rem_minmax(0,1fr)]">
          <dt className="text-muted-foreground">Assessment</dt>
          <dd>
            {snapshot?.state === "saved" ? "Saved snapshot" : "Unsaved preview"}
          </dd>
          {snapshot?.state === "saved" && (
            <>
              <dt className="text-muted-foreground">Snapshot ID</dt>
              <dd className="break-all font-mono">{snapshot.id}</dd>
              {snapshot.created_at && (
                <>
                  <dt className="text-muted-foreground">Created</dt>
                  <dd className="break-all">
                    <time dateTime={snapshot.created_at}>
                      {snapshot.created_at}
                    </time>
                  </dd>
                </>
              )}
              <dt className="text-muted-foreground">Evidence versions</dt>
              <dd>
                {snapshot.superseded
                  ? "Newer evidence available"
                  : "No newer evidence reported"}
              </dd>
            </>
          )}
          {manifest && (
            <>
              <dt className="text-muted-foreground">Compiler version</dt>
              <dd className="break-all font-mono">
                {manifest.compilerVersion}
              </dd>
              <dt className="text-muted-foreground">Selection method</dt>
              <dd className="break-all font-mono">{manifest.method}</dd>
              <dt className="text-muted-foreground">Request IDs</dt>
              <dd>
                <ul className="space-y-1">
                  {manifest.requestIds.map((id) => (
                    <li className="break-all font-mono" key={id}>
                      {id}
                    </li>
                  ))}
                </ul>
              </dd>
            </>
          )}
        </dl>
        {!manifest ? (
          <p className="text-xs text-muted-foreground">
            Source-version details are unavailable for this assessment.
          </p>
        ) : (
          <>
            {manifest.excludedTopics.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Excluded topics: {manifest.excludedTopics.join(", ")}
              </p>
            )}
            {!manifest.documents.length && (
              <p className="text-xs text-muted-foreground">
                No evidence documents are included in this assessment.
              </p>
            )}
            <ol className="space-y-3" aria-label="Evidence version references">
              {manifest.documents.map((doc) => (
                <li
                  key={doc.documentId}
                  className="rounded-lg bg-background p-3 shadow-[0_0_0_1px_var(--border)]"
                >
                  <p className="mb-3 font-medium">
                    {doc.topic.replaceAll("_", " ")}
                  </p>
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
                    <dt className="text-muted-foreground">
                      Source-version IDs
                    </dt>
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
          </>
        )}
      </div>
    </details>
  );
}
