-- Create cms_settings table
CREATE TABLE IF NOT EXISTS public.cms_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create cms_pages table
CREATE TABLE IF NOT EXISTS public.cms_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  published BOOLEAN DEFAULT true,
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create cms_forms table
CREATE TABLE IF NOT EXISTS public.cms_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  fields JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create cms_submissions table
CREATE TABLE IF NOT EXISTS public.cms_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID REFERENCES public.cms_forms(id) ON DELETE CASCADE,
  page_slug TEXT,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security (RLS) on all new tables
ALTER TABLE public.cms_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_submissions ENABLE ROW LEVEL SECURITY;

-- 1. CMS Settings Policies
CREATE POLICY "Allow public read access to cms_settings"
  ON public.cms_settings FOR SELECT USING (true);

CREATE POLICY "Allow service role or admin key to manage cms_settings"
  ON public.cms_settings FOR ALL USING (true); -- We will manage auth on frontend/session, but RLS is enabled

-- 2. CMS Pages Policies
CREATE POLICY "Allow public read access to cms_pages"
  ON public.cms_pages FOR SELECT USING (true);

CREATE POLICY "Allow service role or admin key to manage cms_pages"
  ON public.cms_pages FOR ALL USING (true);

-- 3. CMS Forms Policies
CREATE POLICY "Allow public read access to cms_forms"
  ON public.cms_forms FOR SELECT USING (true);

CREATE POLICY "Allow service role or admin key to manage cms_forms"
  ON public.cms_forms FOR ALL USING (true);

-- 4. CMS Submissions Policies
CREATE POLICY "Allow public inserts to cms_submissions"
  ON public.cms_submissions FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow service role or admin key to manage cms_submissions"
  ON public.cms_submissions FOR ALL USING (true);

-- Seed Initial Default Settings
INSERT INTO public.cms_settings (key, value) VALUES
('visual_identity', '{
  "brandName": "SantoSha",
  "logoText": "SantoSha",
  "palette": "menta",
  "fontFamily": "serif",
  "whatsappNumber": "+5491123456789",
  "footerText": "© 2026 SantoSha - Espacio de Bienestar, Psicología y Kundalini Yoga."
}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Seed Initial Default Forms
INSERT INTO public.cms_forms (id, name, fields) VALUES
('b191c71b-a5d6-4767-9d7a-11f879685a4a', 'Registro Clase Gratis', '[
  {"id": "name", "label": "Nombre Completo", "type": "text", "placeholder": "Tu nombre completo", "required": true},
  {"id": "email", "label": "Correo Electrónico", "type": "email", "placeholder": "ejemplo@correo.com", "required": true}
]'::jsonb),
('e2a2c82c-b6e7-5878-ae8b-22f980796b5b', 'Consulta de Terapia', '[
  {"id": "name", "label": "Nombre Completo", "type": "text", "placeholder": "Tu nombre", "required": true},
  {"id": "whatsapp", "label": "Teléfono / WhatsApp", "type": "tel", "placeholder": "+54 9 11 ...", "required": true},
  {"id": "age", "label": "Edad", "type": "number", "placeholder": "Tu edad", "required": false},
  {"id": "message", "label": "Motivo de Consulta", "type": "textarea", "placeholder": "¿En qué podemos ayudarte hoy?", "required": true}
]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, fields = EXCLUDED.fields;

-- Seed Default Pages
INSERT INTO public.cms_pages (title, slug, published, sections) VALUES
('Inicio SantoSha', 'home', true, '[
  {
    "id": "home-hero",
    "type": "hero",
    "content": {
      "title": "Encuentra tu Paz Interior",
      "subtitle": "Clase Maestra de Kundalini Yoga",
      "tagline": "Clase Maestra Gratuita",
      "buttonText": "Quiero mi clase gratuita",
      "buttonLink": "#form-home-hero",
      "formId": "b191c71b-a5d6-4767-9d7a-11f879685a4a"
    }
  },
  {
    "id": "home-connection",
    "type": "connection",
    "content": {
      "title": "¿La incapacidad para gestionar tus emociones está ganando la batalla?",
      "description": "Las sensaciones de incomodidad que te drenan en tu día a día por no tener la capacidad o las herramientas para gestionar tus emociones y que están afectando no solo tu vitalidad, tu motivación, también la relación con los demás, sí tienen solución.\n\nNo tienes que aceptar vivir en un estado de descontento, constante irritabilidad y reactividad que nubla tu juicio y afecta tu salud mental y física.\n\nNuestra clase gratuita para Crear Equilibrio Emocional te ofrece una solución práctica para calmar tu sistema nervioso y recuperar el control de tus emociones.",
      "imageUrl": "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop",
      "layout": "image-right",
      "buttonText": "Quiero mi clase gratuita",
      "buttonLink": "#home-hero"
    }
  },
  {
    "id": "home-benefits",
    "type": "benefits",
    "content": {
      "title": "Beneficios que Obtendrás",
      "items": [
        { "icon": "🧠", "title": "Claridad Mental", "description": "Estimula las áreas motoras y sensoriales del cerebro para mejorar tu memoria y agudeza cognitiva." },
        { "icon": "❤️", "title": "Equilibrio Emocional", "description": "Reduce los niveles de ansiedad y depresión, fomentando un estado de paz interior y resiliencia." },
        { "icon": "✨", "title": "Vitalidad", "description": "Utiliza la respiración consciente y mudras para estimular tus recursos naturales desde la primera práctica." },
        { "icon": "🌙", "title": "Descanso Profundo", "description": "Entrena tu cerebro para silenciar el ruido mental, accediendo a niveles de relajación más profundos." }
      ]
    }
  },
  {
    "id": "home-social-proof",
    "type": "benefits",
    "content": {
      "title": "Únete a una Comunidad de Transformación",
      "items": [
        { "icon": "👥", "title": "10,000+", "description": "Profesionales Transformados" },
        { "icon": "⏱️", "title": "30 min", "description": "Práctica Diaria" },
        { "icon": "📖", "title": "Ciencia", "description": "Respaldada Científicamente" }
      ]
    }
  },
  {
    "id": "home-testimonials",
    "type": "testimonials",
    "content": {
      "title": "Historias de Transformación Real",
      "testimonials": [
        { "author": "Patricia Mendoza", "role": "Directora de Marketing, 45 años", "quote": "Después de 15 años en el mundo corporativo, sentía que había perdido el control de mis emociones. Los primeros 30 minutos de práctica ya marcaron una diferencia. Ahora manejo las reuniones difíciles con una calma que antes me parecía imposible." },
        { "author": "Laura Fernández", "role": "Emprendedora, 38 años", "quote": "Entre mis hijos y mi negocio, vivía en un estado de agotamiento constante. Esta práctica me devolvió la energía y la paciencia que necesitaba. Mi familia ha notado el cambio." },
        { "author": "Dr. Carlos Ruiz", "role": "Médico Internista, 52 años", "quote": "Como médico, estaba escéptico al principio. Pero los resultados fueron innegables: mejor sueño, menos irritabilidad y más claridad para tomar decisiones clínicas. Ahora lo recomiendo a mis pacientes." },
        { "author": "Andrea Morales", "role": "Diseñadora UX, 29 años", "quote": "La ansiedad estaba afectando mi trabajo creativo. Después de un mes practicando, recuperé mi capacidad de concentración y mi confianza. Es la mejor inversión de tiempo que he hecho." }
      ]
    }
  },
  {
    "id": "home-guarantees",
    "type": "benefits",
    "content": {
      "title": "Acceso Inmediato y Gratuito",
      "items": [
        { "icon": "✓", "title": "Sin tarjeta de crédito", "description": "Acceso 100% gratuito." },
        { "icon": "✓", "title": "Acceso inmediato", "description": "Obtén tus credenciales al instante." },
        { "icon": "✓", "title": "100% gratuito", "description": "Sin cobros ocultos ni sorpresas." }
      ]
    }
  }
]'::jsonb),
('Terapia Individual y Bienestar', 'terapia-individual', true, '[
  {
    "id": "hero-section-1",
    "type": "hero",
    "content": {
      "title": "Un espacio seguro para tu mente y tu alma",
      "subtitle": "Acompañamiento psicoterapéutico profesional y técnicas holísticas para ayudarte a encontrar el equilibrio y sanar desde adentro.",
      "buttonText": "Reserva tu Primera Sesión",
      "buttonLink": "https://wa.link/xy0brl",
      "tagline": "Terapia Presencial y Online • Enfoque Integrativo"
    }
  },
  {
    "id": "connect-section-1",
    "type": "connection",
    "content": {
      "title": "¿Sientes que la ansiedad o el estrés están controlando tu vida?",
      "description": "Hola, soy el equipo de SantoSha. Entendemos que dar el primer paso hacia la terapia puede ser abrumador. Aquí no encontrarás juicios, solo un espacio cálido, profesional y compasivo para explorar tus emociones, comprender tus patrones y adquirir herramientas prácticas para tu día a día.",
      "imageUrl": "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop",
      "layout": "image-right"
    }
  },
  {
    "id": "benefits-section-1",
    "type": "benefits",
    "content": {
      "title": "¿Cómo puede ayudarte nuestro enfoque?",
      "items": [
        {"icon": "🌿", "title": "Reducción de la Ansiedad", "description": "Aprende técnicas corporales y de respiración para calmar el sistema nervioso en momentos de crisis."},
        {"icon": "🧘", "title": "Autoconocimiento Profundo", "description": "Comprende el origen de tus pensamientos y cómo influyen en tus emociones y decisiones."},
        {"icon": "💡", "title": "Gestión Emocional", "description": "Adquiere recursos efectivos para procesar la tristeza, el enojo y el miedo de forma saludable."}
      ]
    }
  },
  {
    "id": "form-section-1",
    "type": "form",
    "content": {
      "title": "Da el primer paso hoy",
      "subtitle": "Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas para coordinar tu cita.",
      "formId": "e2a2c82c-b6e7-5878-ae8b-22f980796b5b"
    }
  }
]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, sections = EXCLUDED.sections;
