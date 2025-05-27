import { NextRequest } from "next/server";
import { z } from "zod";

// Payload schema for Apify webhook
const apifyPayloadSchema = z.object({
  userId: z.any(),
  createdAt: z.any(),
  eventType: z.any(),
  eventData: z.any(),
  resource: z.any(),
});

/**
 * API endpoint for Apify webhooks.
 * Accepts a POST request with a JSON payload and always responds with 200.
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
    // Optionally log or process the payload here
    // console.log("Received Apify webhook:", body);
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
