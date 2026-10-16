import { z } from "zod";

export const viewStateSchema = z
  .object({
    selectedRowIds: z.array(z.string().max(120)).max(100),
    filter: z.string().max(200),
    notes: z.string().max(4000),
    evidenceId: z.string().max(120).nullable(),
  })
  .strict();

export type PlaygroundViewState = z.infer<typeof viewStateSchema>;
export const emptyViewState: PlaygroundViewState = {
  selectedRowIds: [],
  filter: "",
  notes: "",
  evidenceId: null,
};
