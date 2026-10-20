import { vi } from "vitest";
export const fixture = {
  enabled: true,
  actor: "actor-a",
  loading: false,
  listingError: null as Error | null,
  empty: false,
  legacy: vi.fn(),
  reopen: vi.fn(),
  refetch: vi.fn(),
};
export const file = new File(["Unsaved replacement"], "draft.txt");
export const opened = {
  path: "notes/draft.txt",
  sha: "a".repeat(40),
  scopeKey: "actor-a",
  apiBaseUrl: "https://api-synthetic-recoup.vercel.app",
};
