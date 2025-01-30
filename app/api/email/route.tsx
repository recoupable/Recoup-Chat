import { NextRequest, NextResponse } from "next/server";
import loopsClient from "@/lib/loops/client";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const resp: {
      success: boolean;
      id?: string;
      message?: string;
    } = await loopsClient.updateContact(email, {});

    return NextResponse.json({
      success: resp.success,
      message: resp.message || "",
      id: resp.id || "",
    });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
