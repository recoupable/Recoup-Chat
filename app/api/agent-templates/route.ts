import { NextResponse } from "next/server";
import supabase from "@/lib/supabase/serverClient";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('agent_templates')
      .select('title, description, prompt, tags')
      .order('title');
    
    if (error) {
      console.error('Error fetching agent templates:', error);
      return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
    }
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0; 