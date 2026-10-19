export interface OpenedFileRevision {
  path: string;
  sha: string;
  apiBaseUrl: string;
  scopeKey: string;
}

export interface FileReplacementGuard {
  opened: OpenedFileRevision;
  isCurrent: () => boolean;
}

export interface GuardedReplacementOptions {
  enabled: boolean;
  opened?: OpenedFileRevision;
  selectedPath?: string;
  scopeKey: string;
  onSaved: () => void;
}
export interface PendingFileReplacement {
  file: File;
  opened: OpenedFileRevision;
}
