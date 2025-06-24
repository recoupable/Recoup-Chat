import { z } from "zod";

const apifyPayloadSchema = z.object({
  userId: z.any(),
  createdAt: z.any(),
  eventType: z.any(),
  eventData: z.object({
    actorId: z.string(),
    actorTaskId: z.string().optional(),
    actorRunId: z.string(),
  }),
  resource: z.object({
    defaultDatasetId: z.string(),
  }),
});

export default apifyPayloadSchema;
