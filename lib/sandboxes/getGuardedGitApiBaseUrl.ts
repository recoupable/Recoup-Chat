import { getClientApiBaseUrl } from "@/lib/api/getClientApiBaseUrl";

/** Default-off: only an explicitly verified immutable deployment can opt in. */
export function getGuardedGitApiBaseUrl(): string | null {
  const configured = process.env.NEXT_PUBLIC_GUARDED_GIT_API_ORIGIN;
  if (
    !configured ||
    !/^https:\/\/api-[a-z0-9]+-recoup\.vercel\.app$/.test(configured)
  )
    return null;
  return getClientApiBaseUrl() === configured ? configured : null;
}
