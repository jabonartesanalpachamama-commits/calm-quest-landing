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
  IF recent >= 60 THEN
    RAISE EXCEPTION 'Demasiados envíos, intenta más tarde' USING ERRCODE = 'P0001';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.enforce_per_contact_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  k text;
  recent integer := 0;
BEGIN
  IF TG_TABLE_NAME = 'registrations' THEN
    k := lower(regexp_replace(coalesce(NEW.email, ''), '\s', '', 'g'));
    IF k <> '' THEN
      SELECT count(*) INTO recent FROM public.registrations
        WHERE lower(regexp_replace(email, '\s', '', 'g')) = k
          AND created_at > now() - interval '24 hours';
    END IF;
  ELSIF TG_TABLE_NAME = 'chat_leads' THEN
    k := lower(regexp_replace(coalesce(NEW.contact, ''), '\s', '', 'g'));
    IF k <> '' THEN
      SELECT count(*) INTO recent FROM public.chat_leads
        WHERE contact IS NOT NULL
          AND lower(regexp_replace(contact, '\s', '', 'g')) = k
          AND created_at > now() - interval '24 hours';
    END IF;
  ELSIF TG_TABLE_NAME = 'cms_submissions' THEN
    k := lower(regexp_replace(coalesce(NEW.data->>'email', NEW.data->>'correo', ''), '\s', '', 'g'));
    IF k <> '' THEN
      SELECT count(*) INTO recent FROM public.cms_submissions
        WHERE lower(regexp_replace(coalesce(data->>'email', data->>'correo', ''), '\s', '', 'g')) = k
          AND created_at > now() - interval '24 hours';
    END IF;
  END IF;
  IF recent >= 3 THEN
    RAISE EXCEPTION 'Demasiados envíos, intenta más tarde' USING ERRCODE = 'P0001';
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_per_contact_rate_limit() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER registrations_contact_limit BEFORE INSERT ON public.registrations
  FOR EACH ROW EXECUTE FUNCTION public.enforce_per_contact_rate_limit();
CREATE TRIGGER chat_leads_contact_limit BEFORE INSERT ON public.chat_leads
  FOR EACH ROW EXECUTE FUNCTION public.enforce_per_contact_rate_limit();
CREATE TRIGGER cms_submissions_contact_limit BEFORE INSERT ON public.cms_submissions
  FOR EACH ROW EXECUTE FUNCTION public.enforce_per_contact_rate_limit();