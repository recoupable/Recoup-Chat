import { NextRequest } from "next/server";
import sendEmail from "@/lib/email/sendEmail";
import { generateEmailTextForRecipient } from "@/lib/email/generateEmailText";

// Type for AWS SNS POST payload
interface SnsPayload {
  mail?: {
    source?: string;
    messageId?: string;
    commonHeaders?: {
      subject?: string;
    };
  };
  content?: string;
  [key: string]: unknown;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SnsPayload;
    console.log("Received SNS email notification:", body);
    const parsedMessage = body.mail ?? { source: "noreply@example.com" };
    const recipient = parsedMessage.source;
    const messageId = parsedMessage.messageId;
    const subject = parsedMessage.commonHeaders?.subject || "";

    // Decode the email body from base64 if present
    let decodedBody = "";
    if (body.content) {
      try {
        decodedBody = Buffer.from(body.content, "base64").toString("utf-8");
      } catch (e) {
        console.error("Failed to decode base64 email content:", e);
      }
    }

    const text = await generateEmailTextForRecipient(
      recipient || "",
      decodedBody
    );
    console.log("Text:", text);

    try {
      const emailResponse = await sendEmail({
        from: "Recoup <hi@recoupable.com>",
        to: [recipient || ""],
        subject,
        text,
        headers: {
          "In-Reply-To": messageId || "",
          References: messageId || "",
        },
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
