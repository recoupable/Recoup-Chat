import type { CollectionComponent } from "../schema";

/** Names alone and absent values do not make a useful comparison. */
export function hasComparisonDifferences(component: CollectionComponent) {
  if (new Set(component.rows.map((row) => row.id)).size < 2) return false;
  return component.columns.some(({ key }) => {
    const values = component.rows.flatMap((row) => {
      if (!Object.hasOwn(row.values, key)) return [];
      const value = row.values[key].trim();
      return value ? [value] : [];
    });
    return new Set(values).size > 1;
  });
}
