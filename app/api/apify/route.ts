import { NextRequest } from "next/server";
import { z } from "zod";
import getDataset from "@/lib/apify/getDataset";

// Payload schema for Apify webhook
const apifyPayloadSchema = z.object({
  userId: z.any(),
  createdAt: z.any(),
  eventType: z.any(),
  eventData: z.any(),
  resource: z.object({
    defaultDatasetId: z.string(),
  }),
});

/**
 * API endpoint for Apify webhooks.
 * Accepts a POST request with a JSON payload, optionally fetches a dataset, and always responds with 200.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Optionally validate the payload shape
    const parsed = apifyPayloadSchema.safeParse(body);
    console.log("Received Apify webhook:", parsed);
    if (!parsed.success) {
      // Optionally log or handle invalid payloads
      // console.warn("Invalid Apify payload", parsed.error);
    }
    // If datasetId is present, call getDataset
    const datasetId = parsed.data?.resource?.defaultDatasetId;
    let dataset = null;
    if (datasetId) {
      try {
        dataset = await getDataset(datasetId);
        console.log("Fetched dataset from Apify:", dataset);
      } catch (e) {
        console.error("Failed to fetch dataset from Apify:", e);
      }
    }
    return new Response(JSON.stringify({ message: "Apify webhook received" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    // Always respond with 200, even if parsing fails
    return new Response(
      JSON.stringify({ message: "Apify webhook received (invalid JSON)" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
}
