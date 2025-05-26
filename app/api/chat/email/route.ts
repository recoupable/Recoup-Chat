import { NextRequest } from "next/server";
import https from "https";

// Type for AWS SNS POST payload
interface SnsPayload {
  Type: "SubscriptionConfirmation" | "Notification" | string;
  SubscribeURL?: string;
  Message?: string;
  [key: string]: unknown;
}

function confirmSnsSubscription(subscribeUrl: string): Promise<number> {
  return new Promise((resolve, reject) => {
    https
      .get(subscribeUrl, (res) => {
        resolve(res.statusCode || 0);
      })
      .on("error", (e) => {
        reject(e);
      });
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SnsPayload;

    if (body.Type === "SubscriptionConfirmation" && body.SubscribeURL) {
      try {
        const status = await confirmSnsSubscription(body.SubscribeURL);
        const ok = status >= 200 && status < 300;
        return new Response(
          JSON.stringify({
            message: ok
              ? "Subscription confirmed"
              : "Failed to confirm subscription",
            status,
          }),
          {
            status: ok ? 200 : 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      } catch (e) {
        console.error("Error confirming SNS subscription:", e);
        return new Response(
          JSON.stringify({ error: e instanceof Error ? e.message : String(e) }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    if (body.Type === "Notification") {
      // TODO: Process the email data here
      console.log("Received SNS email notification:", body.Message);
      return new Response(
        JSON.stringify({ message: "Notification received" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    // Fallback for other message types
    return new Response(JSON.stringify({ message: "Message received" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in /api/chat/email:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
