ALTER TABLE public.registrations
  ADD CONSTRAINT registrations_name_len CHECK (char_length(name) <= 120),
  ADD CONSTRAINT registrations_email_len CHECK (char_length(email) <= 254);

ALTER TABLE public.chat_leads
  ADD CONSTRAINT chat_leads_name_len CHECK (name IS NULL OR char_length(name) <= 120),
  ADD CONSTRAINT chat_leads_contact_len CHECK (contact IS NULL OR char_length(contact) <= 254),
  ADD CONSTRAINT chat_leads_page_slug_len CHECK (page_slug IS NULL OR char_length(page_slug) <= 200),
  ADD CONSTRAINT chat_leads_source_len CHECK (source IS NULL OR char_length(source) <= 40),
  ADD CONSTRAINT chat_leads_conversation_len CHECK (conversation IS NULL OR octet_length(conversation::text) <= 50000);

ALTER TABLE public.cms_submissions
  ADD CONSTRAINT cms_submissions_page_slug_len CHECK (page_slug IS NULL OR char_length(page_slug) <= 200),
  ADD CONSTRAINT cms_submissions_data_len CHECK (octet_length(data::text) <= 10000);

CREATE OR REPLACE FUNCTION public.enforce_public_insert_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent integer;
BEGIN
  EXECUTE format('SELECT count(*) FROM public.%I WHERE created_at > now() - interval ''1 minute''', TG_TABLE_NAME)
    INTO recent;
  IF recent >= 20 THEN
    RAISE EXCEPTION 'Too many submissions, try again later' USING ERRCODE = 'P0001';
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_public_insert_rate_limit() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER registrations_rate_limit BEFORE INSERT ON public.registrations
  FOR EACH ROW EXECUTE FUNCTION public.enforce_public_insert_rate_limit();
CREATE TRIGGER chat_leads_rate_limit BEFORE INSERT ON public.chat_leads
  FOR EACH ROW EXECUTE FUNCTION public.enforce_public_insert_rate_limit();
CREATE TRIGGER cms_submissions_rate_limit BEFORE INSERT ON public.cms_submissions
  FOR EACH ROW EXECUTE FUNCTION public.enforce_public_insert_rate_limit();

CREATE INDEX IF NOT EXISTS registrations_created_at_idx ON public.registrations (created_at);
CREATE INDEX IF NOT EXISTS chat_leads_created_at_idx ON public.chat_leads (created_at);
CREATE INDEX IF NOT EXISTS cms_submissions_created_at_idx ON public.cms_submissions (created_at);