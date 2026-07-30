GRANT INSERT ON public.registrations TO anon, authenticated;
GRANT SELECT ON public.registrations TO authenticated;
GRANT ALL ON public.registrations TO service_role;