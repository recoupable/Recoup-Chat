import { NextRequest } from "next/server";
import handleApifyWebhook from "@/lib/apify/handleApifyWebhook";
import apifyPayloadSchema from "@/lib/apify/apifyPayloadSchema";

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

    if (parsed.success) {
      const result = await handleApifyWebhook(parsed.data);
      console.log("handleApifyWebhook result:", result);
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
