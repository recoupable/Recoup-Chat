"use client";

import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Evidence, SurfaceComponent } from "@/lib/intelligent-ui/schema";
import { cn } from "@/lib/utils";

interface InlineCollectionProps {
  component: Extract<SurfaceComponent, { type: "collection" }>;
  onInspectEvidence?: (id: string, trigger?: HTMLElement) => void;
  evidence?: Evidence[];
  sourceComplete?: boolean;
  recordLabel?: string;
}

const InlineCollection = ({
  component,
  onInspectEvidence,
  evidence = [],
  sourceComplete = component.complete,
  recordLabel = "Record",
}: InlineCollectionProps) => {
  const headingId = useId();
  const completenessId = useId();
  const [openSources, setOpenSources] = useState<string | null>(null);
  const sourceTriggers = useRef(new Map<string, HTMLButtonElement>());
  const handingOffFocus = useRef(false);
  const evidenceById = new Map(evidence.map((source) => [source.id, source]));
  const hasTableLayout = component.columns.length <= 3;
  const hasSources = component.rows.some((row) => row.evidenceIds.length > 0);
  const referencedIds = new Set(
    component.rows.flatMap((row) => row.evidenceIds),
  );
  const referencedEvidence = [...referencedIds].flatMap(
    (id) => evidenceById.get(id) ?? [],
  );
  const sourceWarnings = (["partial", "withdrawn"] as const).flatMap(
    (status) => {
      const count = referencedEvidence.filter(
        (source) => source.status === status,
      ).length;
      return count
        ? [`${count} ${status} ${count === 1 ? "source" : "sources"}`]
        : [];
    },
  );

  const rows = component.rows.map((row) => {
    const sources = row.evidenceIds.map((id, index) => ({
      id,
      source: evidenceById.get(id),
      label: evidenceById.get(id)?.label ?? `Source ${index + 1}`,
    }));

    const sourceControls = (layout: "table" | "list") => {
      if (sources.length === 0) return null;
      const key = `${layout}:${row.id}`;
      const sourceCount = `${sources.length} ${sources.length === 1 ? "source" : "sources"}`;
      const buttonClassName =
        "min-h-11 shrink-0 rounded-lg px-2 text-xs text-muted-foreground hover:text-foreground focus-visible:ring-2";
      if (sources.length === 1 && onInspectEvidence) {
        return (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label={`Inspect 1 source for ${row.label}`}
            className={buttonClassName}
            onClick={(event) => {
              event.currentTarget.focus({ preventScroll: true });
              onInspectEvidence(sources[0].id, event.currentTarget);
            }}
          >
            {sourceCount}
          </Button>
        );
      }

      return (
        <Popover
          open={openSources === key}
          onOpenChange={(open) => setOpenSources(open ? key : null)}
        >
          <PopoverTrigger asChild>
            <Button
              ref={(element) => {
                if (element) sourceTriggers.current.set(key, element);
                else sourceTriggers.current.delete(key);
              }}
              type="button"
              variant="ghost"
              size="sm"
              aria-label={`${sourceCount} for ${row.label}`}
              className={buttonClassName}
            >
              {sourceCount}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            aria-label={`Sources for ${row.label}`}
            className="w-72 max-w-[calc(100vw-2rem)] border-0 p-2 shadow-[0_0_0_1px_var(--border),0_8px_24px_var(--surface-shadow)] ring-0"
            onCloseAutoFocus={(event) => {
              if (handingOffFocus.current) {
                event.preventDefault();
                handingOffFocus.current = false;
              }
            }}
          >
            <p className="px-3 pt-2 pb-1 text-xs text-muted-foreground">
              Sources for {row.label}
            </p>
            <ul role="list">
              {sources.map(({ id, source, label }) => (
                <li key={id}>
                  {onInspectEvidence ? (
                    <button
                      type="button"
                      className="min-h-11 w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                      onClick={() => {
                        handingOffFocus.current = true;
                        setOpenSources(null);
                        const trigger = sourceTriggers.current.get(key);
                        trigger?.focus({ preventScroll: true });
                        onInspectEvidence(id, trigger);
                      }}
                    >
                      <span className="block break-words [overflow-wrap:anywhere]">
                        {label}
                      </span>
                      {source && (
                        <span className="mt-0.5 block break-words text-xs text-muted-foreground [overflow-wrap:anywhere]">
                          {source.sourceLabel}
                          {source.status !== "current" && ` · ${source.status}`}
                        </span>
                      )}
                    </button>
                  ) : (
                    <div className="px-3 py-2.5 text-sm">
                      <p className="break-words [overflow-wrap:anywhere]">
                        {label}
                      </p>
                      {source && (
                        <p className="mt-0.5 break-words text-xs text-muted-foreground [overflow-wrap:anywhere]">
                          {source.sourceLabel}
                          {source.status !== "current" && ` · ${source.status}`}
                        </p>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      );
    };

    return { row, sourceControls };
  });

  return (
    <section
      aria-labelledby={headingId}
      aria-describedby={
        !component.complete || !sourceComplete ? completenessId : undefined
      }
      className="@container min-w-0 rounded-2xl bg-card text-card-foreground shadow-[0_0_0_1px_var(--border)]"
    >
      <h2
        id={headingId}
        className="break-words px-4 py-4 text-base font-medium tracking-tight [overflow-wrap:anywhere]"
      >
        {component.title}
      </h2>

      {rows.length === 0 ? (
        <p className="px-4 pb-5 text-sm text-muted-foreground">
          {component.complete
            ? "No records in this view."
            : "No records available."}
        </p>
      ) : (
        <>
          {hasTableLayout && (
            <div className="hidden @min-[560px]:block">
              <table className="w-full table-fixed text-left text-sm">
                <caption className="sr-only">{component.title}</caption>
                <thead className="text-xs text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-4 pb-3 font-normal">
                      {recordLabel}
                    </th>
                    {component.columns.map((column) => (
                      <th
                        key={column.key}
                        scope="col"
                        className="break-words px-3 pb-3 font-normal [overflow-wrap:anywhere]"
                      >
                        {column.label}
                      </th>
                    ))}
                    {hasSources && (
                      <th
                        scope="col"
                        className="w-24 pr-4 pb-3 text-right font-normal"
                      >
                        <span className="sr-only">Sources</span>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ row, sourceControls }) => (
                    <tr
                      key={row.id}
                      className="align-top shadow-[0_-1px_0_var(--border)]"
                    >
                      <th
                        scope="row"
                        className="break-words px-4 py-4 font-medium [overflow-wrap:anywhere]"
                      >
                        {row.label}
                      </th>
                      {component.columns.map((column) => (
                        <td
                          key={column.key}
                          className="whitespace-pre-wrap break-words px-3 py-4 text-muted-foreground [overflow-wrap:anywhere]"
                        >
                          {Object.hasOwn(row.values, column.key)
                            ? row.values[column.key]
                            : "Not provided"}
                        </td>
                      ))}
                      {hasSources && (
                        <td className="py-2.5 pr-2 text-right">
                          {sourceControls("table")}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <ul
            role="list"
            aria-label={`${component.title} records`}
            className={cn(hasTableLayout && "@min-[560px]:hidden")}
          >
            {rows.map(({ row, sourceControls }) => (
              <li
                key={row.id}
                className="min-w-0 px-4 py-4 shadow-[0_-1px_0_var(--border)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 py-1.5">
                    <h3 className="break-words text-sm font-medium [overflow-wrap:anywhere]">
                      {row.label}
                    </h3>
                  </div>
                  <div className="-mt-1 -mr-2 shrink-0">
                    {sourceControls("list")}
                  </div>
                </div>
                <dl className="mt-2 grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-x-4 gap-y-2 text-sm">
                  {component.columns.map((column) => (
                    <div key={column.key} className="contents">
                      <dt className="break-words text-muted-foreground [overflow-wrap:anywhere]">
                        {column.label}
                      </dt>
                      <dd className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                        {Object.hasOwn(row.values, column.key)
                          ? row.values[column.key]
                          : "Not provided"}
                      </dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>
        </>
      )}

      {(!component.complete ||
        !sourceComplete ||
        sourceWarnings.length > 0) && (
        <div className="space-y-1 px-4 py-3 text-xs leading-5 text-muted-foreground shadow-[0_-1px_0_var(--border)]">
          {!component.complete && (
            <p id={completenessId}>
              {component.totalCount !== undefined
                ? `Partial collection · ${component.rows.length} of ${component.totalCount} records available.`
                : `Partial collection · ${component.rows.length} ${component.rows.length === 1 ? "record" : "records"} available. More may exist.`}
            </p>
          )}
          {component.complete && !sourceComplete && (
            <p id={completenessId}>
              Original collection is incomplete; this view contains only the
              requested records.
            </p>
          )}
          {sourceWarnings.length > 0 && <p>{sourceWarnings.join(" · ")}</p>}
        </div>
      )}
    </section>
  );
};

export default InlineCollection;
