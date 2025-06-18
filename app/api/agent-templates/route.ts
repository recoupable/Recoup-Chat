import { NextResponse } from "next/server";
import { getAgentTemplates } from "@/lib/supabase/agent_templates/getAgentTemplates";

export async function GET() {
  try {
    const data = await getAgentTemplates();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching agent templates:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0; 