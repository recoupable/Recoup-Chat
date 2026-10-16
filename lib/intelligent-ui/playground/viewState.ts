import { z } from "zod";

export const viewStateSchema = z
  .object({
    selectedRowIds: z.array(z.string().max(128)).max(100),
    filter: z.string().max(200),
    notes: z.string().max(4000),
    draftCreated: z.boolean().optional(),
    evidenceId: z.string().max(128).nullable(),
  })
  .strict();

// JSON can escape each UTF-16 code unit into six characters. Include every
// bounded field at its maximum plus room for the fixed object/array syntax.
export const VIEW_STATE_MAX_SERIALIZED_LENGTH =
  6 * (100 * 128 + 128 + 200 + 4000) + 512;

export type PlaygroundViewState = z.infer<typeof viewStateSchema>;
export const emptyViewState: PlaygroundViewState = {
  selectedRowIds: [],
  filter: "",
  notes: "",
  evidenceId: null,
};
