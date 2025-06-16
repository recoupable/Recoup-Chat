-- Create scheduled_actions table
CREATE TABLE IF NOT EXISTS public.scheduled_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    prompt TEXT NOT NULL,
    schedule TEXT NOT NULL, -- cron string
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    artist_account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    enabled BOOLEAN DEFAULT TRUE,
    last_run TIMESTAMPTZ,
    next_run TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_scheduled_actions_account_id ON public.scheduled_actions(account_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_actions_artist_account_id ON public.scheduled_actions(artist_account_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_actions_next_run ON public.scheduled_actions(next_run); 