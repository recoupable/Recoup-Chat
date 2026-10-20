import { describe, expect, it } from "vitest";
import { formatReportingPeriod } from "../formatReportingPeriod";
import { formatTime } from "../formatTime";

describe("stable reporting labels", () => {
  it.each([
    ["2026-09-01", "2026-09-30", "Sep 1–30, 2026"],
    ["2026-09-30", "2026-10-02", "Sep 30 – Oct 2, 2026"],
    ["2025-12-31", "2026-01-02", "Dec 31, 2025 – Jan 2, 2026"],
    ["2026-09-01", "2026-09-01", "Sep 1, 2026"],
  ])(
    "formats %s through %s without ICU range formatting",
    (start, end, expected) => {
      expect(formatReportingPeriod(start, end)).toBe(expected);
    },
  );
});

describe("media time labels", () => {
  it.each([
    [0, "0:00"],
    [48.9, "0:48"],
    [3599, "59:59"],
    [3600, "1:00:00"],
    [5401, "1:30:01"],
    [86400, "24:00:00"],
  ])("formats %s seconds as %s", (seconds, expected) => {
    expect(formatTime(seconds)).toBe(expected);
  });
});
