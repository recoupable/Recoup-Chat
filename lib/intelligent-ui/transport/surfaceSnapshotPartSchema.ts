import { z } from "zod";
import { identifierSchema } from "../contractValues";
import { surfaceSchema } from "../schema";

export const surfaceSnapshotPartSchema = z
  .object({
    type: z.literal("data-intelligent-ui-snapshot"),
    id: identifierSchema,
    data: surfaceSchema,
  })
  .strict();

export type SurfaceSnapshotPart = z.infer<typeof surfaceSnapshotPartSchema>;
