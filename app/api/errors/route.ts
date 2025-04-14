import { NextResponse } from "next/server";
import { Message } from "ai";
import { sendErrorNotification } from "@/lib/telegram/sendErrorNotification";

interface ClientErrorContext {
  error: {
    name: string;
    message: string;
    stack?: string;
  };
  email?: string;
  roomId?: string;
  path: string;
  messages?: Message[];
}

export async function POST(request: Request) {
  try {
    const context: ClientErrorContext = await request.json();

    await sendErrorNotification({
      error: new Error(context.error.message),
      email: context.email,
      roomId: context.roomId,
      path: context.path,
      messages: context.messages,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing error report:", error);
    return NextResponse.json(
      { error: "Failed to process error report" },
      { status: 500 }
    );
  }
}
