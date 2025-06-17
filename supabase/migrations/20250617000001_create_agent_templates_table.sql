-- Create agent_templates table for MYC-2246 P1
-- Migrating agents.json to Supabase database

CREATE TABLE agent_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  prompt text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  updated_at timestamp with time zone DEFAULT now()
);

-- Add updated_at trigger
CREATE TRIGGER set_updated_at_agent_templates
  BEFORE UPDATE ON agent_templates
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

-- Basic index for performance
CREATE INDEX idx_agent_templates_title ON agent_templates(title); 