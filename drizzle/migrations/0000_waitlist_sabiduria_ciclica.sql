CREATE TABLE public.waitlist_sabiduria_ciclica (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL CHECK (char_length(nombre) BETWEEN 1 AND 120),
  correo text NOT NULL CHECK (char_length(correo) BETWEEN 3 AND 254),
  whatsapp text NULL CHECK (whatsapp IS NULL OR char_length(whatsapp) <= 30),
  pais text NULL CHECK (pais IS NULL OR char_length(pais) <= 80),
  consentimiento boolean NOT NULL CHECK (consentimiento = true),
  consentimiento_fecha timestamptz NOT NULL DEFAULT now(),
  consentimiento_texto text NOT NULL,
  origen text NOT NULL DEFAULT 'landing',
  estado text NOT NULL DEFAULT 'en lista' CHECK (estado IN ('en lista','avisada','inscrita','dada de baja')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX waitlist_sabiduria_ciclica_correo_key ON public.waitlist_sabiduria_ciclica (lower(correo));

CREATE OR REPLACE FUNCTION public.normalize_waitlist_correo()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.correo := lower(btrim(NEW.correo));
  NEW.nombre := btrim(NEW.nombre);
  RETURN NEW;
END $$;
CREATE TRIGGER waitlist_sabiduria_ciclica_normalize BEFORE INSERT OR UPDATE ON public.waitlist_sabiduria_ciclica
FOR EACH ROW EXECUTE FUNCTION public.normalize_waitlist_correo();
REVOKE EXECUTE ON FUNCTION public.normalize_waitlist_correo() FROM PUBLIC;

GRANT INSERT ON public.waitlist_sabiduria_ciclica TO anon, authenticated;
GRANT SELECT ON public.waitlist_sabiduria_ciclica TO authenticated;
GRANT ALL ON public.waitlist_sabiduria_ciclica TO service_role;

ALTER TABLE public.waitlist_sabiduria_ciclica ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can join waitlist" ON public.waitlist_sabiduria_ciclica
FOR INSERT TO anon, authenticated
WITH CHECK (consentimiento = true AND estado = 'en lista' AND origen = 'landing');

CREATE POLICY "Admins can read waitlist" ON public.waitlist_sabiduria_ciclica
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));