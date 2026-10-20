import { getGuardedGitApiBaseUrl } from "./getGuardedGitApiBaseUrl";
import type { FileReplacementGuard } from "./guardedFileTypes";

/** Check before staging and again before committing; never downgrade to legacy. */
export function assertFileReplacementGuard(
  guard: FileReplacementGuard,
  files: File[],
  path?: string,
): void {
  const targetPath = path ? `${path}/${files[0]?.name}` : files[0]?.name;
  if (
    files.length !== 1 ||
    !/^[a-f0-9]{40}$/.test(guard.opened.sha) ||
    !guard.opened.scopeKey ||
    targetPath !== guard.opened.path ||
    getGuardedGitApiBaseUrl() !== guard.opened.apiBaseUrl ||
    !guard.isCurrent()
  ) {
    throw new Error(
      "Reopen the file in the same account and connection before replacing it.",
    );
  }
}
