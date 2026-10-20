"use client";

import { Analytics } from "@vercel/analytics/next";
import { usePathname } from "next/navigation";

/** Consent URLs carry transient handles and must not enter page analytics. */
export default function PageAnalytics() {
  const pathname = usePathname();
  if (pathname.startsWith("/oauth/")) return null;
  return (
    <Analytics
      beforeSend={(event) => {
        // This filter remains useful if the analytics script was loaded before an OAuth navigation.
        try {
          return new URL(event.url).pathname.startsWith("/oauth/")
            ? null
            : event;
        } catch {
          return null;
        }
      }}
    />
  );
}
