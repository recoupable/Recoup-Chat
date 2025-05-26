import { NextRequest } from "next/server";
import https from "https";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Handle AWS SNS Subscription Confirmation
    if (body.Type === "SubscriptionConfirmation" && body.SubscribeURL) {
      // Confirm the subscription by making a GET request to SubscribeURL
      https
        .get(body.SubscribeURL, (res) => {
          console.log("SNS Subscription confirmed! Status:", res.statusCode);
        })
        .on("error", (e) => {
          console.error("Error confirming SNS subscription:", e);
        });
      return new Response(
        JSON.stringify({ message: "Subscription confirmation in process" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    // Handle actual notifications
    if (body.Type === "Notification") {
      console.log("Received SNS email notification:", body.Message);
      // TODO: Process the email data here
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
