REVOKE ALL ON public.newsletter_subscribers FROM anon, authenticated;
GRANT INSERT (email, source_page) ON public.newsletter_subscribers TO anon, authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;