import loopsClient from "@/lib/loops/client";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  try {
    const resp: {
      success: boolean;
      id?: string;
      message?: string;
    } = await loopsClient.updateContact(email as string, {});
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
