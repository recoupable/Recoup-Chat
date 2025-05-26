import { NextRequest } from "next/server";
import sendEmail from "@/lib/email/sendEmail";
import generateText from "@/lib/ai/generateText";

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

    // Generate the auto-reply text using generateText
    const prompt =
      "write a simple auto response email for inbound musician management request. from the company Recoup. only include the email body. no headers or subject";
    let text;

    try {
      const generated = await generateText({
        prompt,
      });
      text = generated.text;
      console.log("Text:", text);
    } catch (e) {
      console.error("Failed to generate auto-reply text:", e);
    }

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
      JSON.stringify({
        message: "Notification received, auto-reply sent",
        text,
      }),
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
