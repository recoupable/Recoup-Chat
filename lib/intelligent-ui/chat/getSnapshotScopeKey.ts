export interface SnapshotHostScope {
  actorId: string;
  accountId: string;
  workspaceId: string;
  sessionId: string;
  chatId: string;
  subject: { kind: string; id: string };
}

/** A lifecycle/cache identity supplied by the host, never an authorization grant. */
export function getSnapshotScopeKey(scope: SnapshotHostScope): string {
  return JSON.stringify([
    scope.actorId,
    scope.accountId,
    scope.workspaceId,
    scope.sessionId,
    scope.chatId,
    scope.subject.kind,
    scope.subject.id,
  ]);
}
