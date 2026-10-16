import { useId } from "react";
import { ListFilter } from "lucide-react";
import type { CollectionComponent } from "@/lib/intelligent-ui/schema";
import { cn } from "@/lib/utils";
import EvidenceButtons from "./EvidenceButtons";

interface SurfaceCollectionProps {
  component: CollectionComponent;
  selectedRowIds: string[];
  onSelectRow: (id: string) => void;
  onInspectEvidence: (id: string) => void;
  filter: string;
}

const SurfaceCollection = ({
  component,
  selectedRowIds,
  onSelectRow,
  onInspectEvidence,
  filter,
}: SurfaceCollectionProps) => {
  const headingId = useId();
  const completenessId = useId();
  const query = filter.trim().toLocaleLowerCase();
  const rows = component.rows.filter((row) =>
    [row.label, ...Object.values(row.values)]
      .join(" ")
      .toLocaleLowerCase()
      .includes(query),
  );
  const available = component.rows.length;
  const total = component.totalCount;

  return (
    <section
      aria-labelledby={headingId}
      className="min-w-0 overflow-hidden rounded-2xl bg-card shadow-[0_0_0_1px_var(--border)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 p-5 sm:p-6">
        <div className="min-w-0">
          <h3
            id={headingId}
            className="break-words text-lg font-medium tracking-tight"
          >
            {component.title}
          </h3>
          <p
            id={completenessId}
            className="mt-1 text-xs leading-5 text-muted-foreground"
          >
            {total !== undefined && total !== available
              ? `${available} of ${total} records available`
              : `${available} ${available === 1 ? "record" : "records"} available`}
            {!component.complete && " · More records may exist"}
          </p>
        </div>
        <span className="rounded-full bg-secondary px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-secondary-foreground">
          {component.complete ? "Complete collection" : "Partial collection"}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 bg-muted/50 px-5 py-2.5 text-xs text-muted-foreground sm:px-6">
        <span role="status" aria-live="polite" aria-atomic="true">
          {query
            ? `Showing ${rows.length} of ${available} available records`
            : "Select one or more records"}
        </span>
        <span>Selection stays local</span>
      </div>

      {rows.length > 0 ? (
        <div
          role="region"
          aria-label={`${component.title} records, scroll horizontally for more columns`}
          tabIndex={0}
          className="overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        >
          <table
            className="w-full text-left text-sm"
            aria-describedby={completenessId}
          >
            <caption className="sr-only">
              {component.title}. Select records and inspect their sources.
            </caption>
            <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th scope="col" className="w-12 pl-3 sm:pl-4">
                  <span className="sr-only">Select</span>
                </th>
                <th scope="col" className="min-w-40 px-2 py-4 font-medium">
                  Record
                </th>
                {component.columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="min-w-28 px-3 py-4 font-medium"
                  >
                    {column.label}
                  </th>
                ))}
                <th scope="col" className="min-w-28 px-3 py-4 pr-5 font-medium">
                  Evidence
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const selected = selectedRowIds.includes(row.id);
                return (
                  <tr
                    key={row.id}
                    className={cn(
                      "shadow-[0_-1px_0_var(--border)] transition-colors motion-reduce:transition-none",
                      selected ? "bg-secondary" : "hover:bg-muted/40",
                    )}
                  >
                    <td className="pl-2 sm:pl-3">
                      <label className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg focus-within:ring-2 focus-within:ring-ring">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => onSelectRow(row.id)}
                          className="size-4 cursor-pointer accent-primary focus:outline-none"
                        />
                        <span className="sr-only">Select {row.label}</span>
                      </label>
                    </td>
                    <th
                      scope="row"
                      className="max-w-64 break-words px-2 py-4 font-medium [overflow-wrap:anywhere]"
                    >
                      {row.label}
                    </th>
                    {component.columns.map((column) => (
                      <td
                        key={column.key}
                        className="max-w-64 break-words px-3 py-4 text-muted-foreground [overflow-wrap:anywhere]"
                      >
                        {row.values[column.key] ?? "Not provided"}
                      </td>
                    ))}
                    <td className="px-3 py-2 pr-5">
                      <EvidenceButtons
                        evidenceIds={row.evidenceIds}
                        label={row.label}
                        onInspectEvidence={onInspectEvidence}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center px-6 py-12 text-center">
          <ListFilter
            aria-hidden="true"
            className="mb-3 size-6 text-muted-foreground"
            strokeWidth={1.5}
          />
          <p className="text-sm font-medium">
            {query ? "No matching records" : "No records available"}
          </p>
          <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
            {query
              ? "Try a different filter. Your selections are preserved."
              : component.complete
                ? "This collection does not contain any records."
                : "This is a partial collection. An empty result does not mean no records exist."}
          </p>
        </div>
      )}
    </section>
  );
};

export default SurfaceCollection;
