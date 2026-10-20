// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { distributionSchema } from "@/lib/intelligent-ui/representations/schemas";
import DistributionView from "../DistributionView";

afterEach(cleanup);

describe("DistributionView", () => {
  it("keeps full values and long names readable without adding controls", () => {
    const label = "A".repeat(160);
    const component = distributionSchema.parse({
      type: "distribution",
      id: "conformance-values",
      title: "Synthetic value boundaries",
      measure: {
        label: "Supplied count",
        unit: "observations",
        periodStart: "2026-09-01",
        periodEnd: "2026-09-30",
        population: "Three synthetic records",
      },
      items: [
        { id: "maximum", label, value: 1e12, evidenceIds: [] },
        { id: "fraction", label: "Fraction", value: 0.125, evidenceIds: [] },
        { id: "zero", label: "Zero", value: 0, evidenceIds: [] },
      ],
      complete: true,
      totalCount: 3,
    });
    render(<DistributionView component={component} />);
    const figure = screen.getByRole("figure", {
      name: "Synthetic value boundaries",
    });
    const rows = within(figure).getAllByRole("listitem");
    expect(rows).toHaveLength(3);
    expect(within(rows[0]).getByText(label)).toBeTruthy();
    expect(within(rows[0]).getByText("1,000,000,000,000").textContent).toBe(
      "1,000,000,000,000 observations",
    );
    expect(within(rows[1]).getByText("0.125")).toBeTruthy();
    expect(within(rows[2]).getByText("0")).toBeTruthy();
    expect(within(figure).queryByRole("button")).toBeNull();
    expect(within(figure).queryByRole("slider")).toBeNull();
  });
});
