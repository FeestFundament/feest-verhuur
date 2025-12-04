-- Create table to track email rate limits
CREATE TABLE public.email_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient lookups
CREATE INDEX idx_email_rate_limits_ip_date ON public.email_rate_limits (ip_address, sent_at);

-- No RLS needed - this table is only accessed by the edge function with service role