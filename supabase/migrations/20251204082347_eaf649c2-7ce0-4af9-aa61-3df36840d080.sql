-- Enable RLS on email_rate_limits (no policies = no public access, only service role can access)
ALTER TABLE public.email_rate_limits ENABLE ROW LEVEL SECURITY;