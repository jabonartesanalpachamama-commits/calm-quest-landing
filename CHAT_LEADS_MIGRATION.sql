-- ============================================================
-- CHAT_LEADS: Tabla para leads capturados por el Agente IA
-- Pegar esto en Supabase Studio → SQL Editor → Run
-- ============================================================

CREATE TABLE IF NOT EXISTS public.chat_leads (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug   text,
  name        text,
  contact     text,           -- email o número de WhatsApp
  source      text DEFAULT 'chat',
  conversation jsonb DEFAULT '[]'::jsonb,  -- historial [{role, content}]
  created_at  timestamptz DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.chat_leads ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede insertar (visitantes del sitio)
CREATE POLICY "Allow public insert on chat_leads"
  ON public.chat_leads FOR INSERT
  WITH CHECK (true);

-- Política: Solo autenticados pueden leer (admin)
-- (Usamos la misma auth anónima que el resto del CMS, sin auth de usuario)
-- Como el admin usa la misma API key anónima, permitimos lectura pública
-- Si quieres restringirlo solo al admin, usa service_role key en producción
CREATE POLICY "Allow public read on chat_leads"
  ON public.chat_leads FOR SELECT
  USING (true);

-- Índice para ordenar por fecha
CREATE INDEX IF NOT EXISTS chat_leads_created_at_idx ON public.chat_leads(created_at DESC);
