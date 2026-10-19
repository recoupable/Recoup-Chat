import { getGuardedGitApiBaseUrl } from "./getGuardedGitApiBaseUrl";
import type {
  GuardedReplacementOptions,
  OpenedFileRevision,
} from "./guardedFileTypes";

/** Match the committed view context without substituting a newer revision. */
export function isOpenedRevisionCurrent(
  current: GuardedReplacementOptions,
  opened: OpenedFileRevision,
): boolean {
  return (
    current.enabled &&
    current.scopeKey === opened.scopeKey &&
    current.selectedPath === opened.path &&
    current.opened?.sha === opened.sha &&
    current.opened.apiBaseUrl === opened.apiBaseUrl &&
    getGuardedGitApiBaseUrl() === opened.apiBaseUrl
  );
}
