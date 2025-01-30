import { NextRequest, NextResponse } from "next/server";
import { getAccountByPhone } from "@/lib/supabase/getAccountByPhone";
import { getOrCreateAccountByEmail } from "@/lib/supabase/getAccountByEmail";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body.email;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const data = await getOrCreateAccountByEmail(email);
    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    try {
      const data = await getAccountByPhone(phone);
      return NextResponse.json({ data });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      // Return 404 for "No account found" message, 500 for other errors
      const status = message.includes("No account found") ? 404 : 500;
      return NextResponse.json({ error: message }, { status });
    }
  } catch (error) {
    console.error("Error in /api/account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
