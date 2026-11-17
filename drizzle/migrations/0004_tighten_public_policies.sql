DROP POLICY IF EXISTS "Allow public insert on chat_leads" ON public.chat_leads;
CREATE POLICY "Public can submit chat leads" ON public.chat_leads FOR INSERT TO anon, authenticated
  WITH CHECK (source = 'chat' AND (name IS NOT NULL OR contact IS NOT NULL));

DROP POLICY IF EXISTS "Anyone can register" ON public.registrations;
CREATE POLICY "Public can register" ON public.registrations FOR INSERT TO anon, authenticated
  WITH CHECK (char_length(btrim(name)) > 0 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');

DROP POLICY IF EXISTS "Allow public inserts to cms_submissions" ON public.cms_submissions;
CREATE POLICY "Public can submit CMS forms" ON public.cms_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (form_id IS NOT NULL AND jsonb_typeof(data) = 'object');

DROP POLICY IF EXISTS "Allow public read access to cms_forms" ON public.cms_forms;
CREATE POLICY "Public can read forms embedded in pages" ON public.cms_forms FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.cms_pages p WHERE strpos(p.sections::text, cms_forms.id::text) > 0));

DROP POLICY IF EXISTS "Allow public read access to cms_settings" ON public.cms_settings;
CREATE POLICY "Public can read site settings" ON public.cms_settings FOR SELECT TO anon, authenticated
  USING (key IN ('visual_identity', 'ai_agent_config'));