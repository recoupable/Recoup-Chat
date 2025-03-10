-- Drop the social_platform column and add social_id with foreign key reference
ALTER TABLE "public"."agent_status" 
    DROP COLUMN IF EXISTS "social_platform",
    ADD COLUMN "social_id" uuid NOT NULL;

-- Add foreign key constraint
ALTER TABLE "public"."agent_status"
    ADD CONSTRAINT "agent_status_social_id_fkey" 
    FOREIGN KEY (social_id) 
    REFERENCES socials(id) 
    ON DELETE CASCADE;

-- Create an index for the foreign key for better join performance
CREATE INDEX idx_agent_status_social_id ON public.agent_status(social_id); 