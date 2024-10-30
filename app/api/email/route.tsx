import loopsClient from "@/lib/loops/client";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = body.email;

  try {
    const resp: {
      success: boolean;
      id?: string;
      message?: string;
    } = await loopsClient.updateContact(email, {});
    return Response.json({
      success: resp.success,
      message: resp.message || "",
      id: resp.id || "",
    });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
