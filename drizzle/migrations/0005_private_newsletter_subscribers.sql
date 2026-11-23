CREATE TABLE public.newsletter_subscribers (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 email text NOT NULL UNIQUE,
 consent_at timestamptz NOT NULL DEFAULT now(),
 source_page text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT (email, source_page) ON public.newsletter_subscribers TO anon, authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public may subscribe only" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (source_page IN ('home', 'testimonios'));
CREATE FUNCTION public.validate_newsletter_subscriber() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 NEW.email := lower(btrim(NEW.email));
 IF char_length(NEW.email) > 255 OR NEW.email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' OR NEW.source_page NOT IN ('home', 'testimonios') THEN
  RAISE EXCEPTION 'Datos de suscripción inválidos' USING ERRCODE = '22023';
 END IF;
 NEW.consent_at := now();
 NEW.created_at := now();
 PERFORM pg_advisory_xact_lock(hashtextextended(NEW.email, 0));
 IF EXISTS (SELECT 1 FROM public.newsletter_subscribers WHERE email = NEW.email) THEN RETURN NULL; END IF;
 RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.validate_newsletter_subscriber() FROM PUBLIC;
CREATE TRIGGER a_newsletter_rate_limit BEFORE INSERT ON public.newsletter_subscribers FOR EACH ROW EXECUTE FUNCTION public.enforce_public_insert_rate_limit();
CREATE TRIGGER b_newsletter_validate BEFORE INSERT ON public.newsletter_subscribers FOR EACH ROW EXECUTE FUNCTION public.validate_newsletter_subscriber();