-- Create registrations table for yoga masterclass leads
CREATE TABLE public.registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert registrations (public lead capture form)
CREATE POLICY "Anyone can register" 
ON public.registrations 
FOR INSERT 
WITH CHECK (true);

-- Only service role can read registrations (for admin/backend use)
CREATE POLICY "Service role can read registrations" 
ON public.registrations 
FOR SELECT 
USING (false);

-- Create index on email for faster lookups
CREATE INDEX idx_registrations_email ON public.registrations(email);