import { NextRequest } from "next/server";
import sendEmail from "@/lib/email/sendEmail";

// Type for AWS SNS POST payload
interface SnsPayload {
  Type: "SubscriptionConfirmation" | "Notification" | string;
  SubscribeURL?: string;
  mail?: {
    source?: string;
  };
  [key: string]: unknown;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SnsPayload;
    console.log("Received SNS email notification:", body);
    const parsedMessage = body.mail ?? { source: "noreply@example.com" };
    const recipient = parsedMessage.source;
    const subject = "Thank you for your email";
    const text = "This is an automated reply. We have received your message.";
    try {
      const emailResponse = await sendEmail({
        from: "Recoup <hi@recoupable.com>",
        to: [recipient || ""],
        subject,
        text,
      });
      if (
        emailResponse &&
        typeof emailResponse !== "string" &&
        "json" in emailResponse
      ) {
        console.log("Auto-reply sent:", await emailResponse.json());
      } else {
        console.log("Auto-reply sent (no response body)");
      }
    } catch (e) {
      console.error("Failed to send auto-reply:", e);
    }
    return new Response(
      JSON.stringify({ message: "Notification received, auto-reply sent" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
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
