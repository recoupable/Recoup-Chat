import supabase from "@/lib/supabase/serverClient";

export async function getAgentTemplates() {
  const { data, error } = await supabase
    .from('agent_templates')
    .select('title, description, prompt, tags')
    .order('title');
  
  if (error) {
    throw error;
  }
  
  return data || [];
} 